import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  XIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import PostPageItem from "../components/PostPageItem";
import TopCommunities from "../components/TopCommunities";
import f1 from "../fake data/f1.png";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../slices/appSlice";
import { useSearchParams } from "react-router-dom";
import { ChatIcon } from "@heroicons/react/outline";
import TextareaAutosize from "react-textarea-autosize";

import { useSelector } from "react-redux";
import { setLoginVisible, setSignUpVisible } from "../slices/appSlice";

import socket from "../websockets/posts";

const handleLike = async (commentId) => {
  const result = await axios.post(`/api/comments/${commentId}/like`);
  console.log(result);
};

const handleSubmitComment = async (
  directReplyToPost,
  comment,
  subredditId,
  postId,
  commentId
) => {
  const data = {
    text: comment,
    directReplyToPost,
    subredditId: subredditId,
    userId: "2", // localstorage.getItem("...")
    postId: postId,
  };
  if (commentId && !directReplyToPost) {
    data.commentId = commentId;
  }
  const result = await axios.post("/api/comments", data).catch((e) => {
    return { success: false };
  });
  return { success: true };
  console.log(result);
};

const Avatar = ({ createdAt }) => {
  const date = new Date(createdAt);

  return (
    <div className="flex space-x-2 items-center">
      <div className="rounded-full overflow-hidden h-5 w-5 sm:h-8 sm:w-8">
        <img src={f1} />
      </div>
      <p className=" flex items-center text-xs font-medium  text-gray-900">
        Anpes99{" "}
        <p className="font-sm ml-2 text-gray-500">
          {moment(date.getTime()).fromNow()}
        </p>
      </p>
    </div>
  );
};

const CommentCommentSection = ({
  commentId,
  setComment,
  comment,
  setVisible,
  visible,
  subredditId,
  postId,
}) => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  return (
    <>
      <p
        className={`${
          error ? "text-red-600" : "text-green-600"
        } font-medium text-medium`}
      >
        {message && message}
      </p>

      <div className={`mb-5 ${visible ? "block" : "hidden"}`}>
        <TextareaAutosize
          onChange={(event) => {
            setComment(event.target.value);
          }}
          className="w-full px-5 pt-3 border m-0 min-h-[5rem] "
        />
        <div className="bg-gray-100 w-full h-10 -mt-1.5 rounded-b-md flex items-center justify-end">
          <button
            onClick={async () => {
              const res = await handleSubmitComment(
                false,
                comment,
                subredditId,
                postId,
                commentId
              );
              if (res.success) {
                setVisible(false);
                setMessage("new comment created");
                setTimeout(() => {
                  setMessage(null);
                }, 3000);
              }
            }}
            className="join-btn mr-5 "
          >
            Comment
          </button>
        </div>
      </div>
    </>
  );
};

const CommentActionsBar = ({ post, comment }) => {
  const [newComment, setNewComment] = useState("");
  const [createCommentVisible, setCreateCommentVisible] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex  sm:p-2 items-center space-x-1 text-gray-400 font-semibold text-xs">
        <ArrowSmUpIcon
          onClick={() => {
            handleLike(comment.id);
          }}
          className="text-gray-400 w-4 hover:text-red-500 cursor-pointer"
        />
        <p className=" font-bold">{comment.upVotes - comment.downVotes}</p>
        <ArrowSmDownIcon className="w-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
        <p
          onClick={() => {
            setCreateCommentVisible(!createCommentVisible);
          }}
          className="flex items-center hover:bg-gray-200 cursor-pointer"
        >
          <ChatIcon className="hidden sm:inline-block h-6 mr-1" /> Reply
        </p>
        <p className="hover:bg-gray-200 cursor-pointer">Share</p>
        <p className="hover:bg-gray-200 cursor-pointer">Report</p>
        <p className="hover:bg-gray-200 cursor-pointer">Save</p>
        <p className="hover:bg-gray-200 cursor-pointer">Follow</p>
      </div>
      <CommentCommentSection
        commentId={comment.id}
        comment={newComment}
        setComment={setNewComment}
        visible={createCommentVisible}
        setVisible={setCreateCommentVisible}
        subredditId={post.subredditId}
        postId={post.id}
      />
    </div>
  );
};

const PostPage = () => {
  const navigate = useNavigate();
  const [sortVisible, setSortVisible] = useState(false);

  const [post, setPost] = useState({});
  const [commentPost, setCommentPost] = useState("");
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");

  const postId = useParams().postId;
  let comments;

  const user = useSelector((state) => state.app.user);

  useEffect(async () => {
    let queryString = "";
    queryString = sortBy ? queryString + "&sortBy=" + sortBy : queryString;
    queryString = order ? queryString + "&order=" + order : queryString;
    const result = await axios.get(
      `/api/posts/${postId}?commentCommentAmount=10${queryString}`
    );
    setPost(result.data);
  }, []);

  const handleLike = async () => {
    socket.emit("likePost", post.id);
  };
  const handleDislike = async () => {
    socket.emit("dislikePost", post.id);
  };

  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        if (sortVisible) setSortVisible(false);
      }}
      className="flex flex-col"
    >
      <Header />
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="bg-gray-600"
      >
        <main className=" max-w-screen-xl mx-auto bg-white">
          <div className="h-10 bg-black flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center">
              <div className="flex text-gray-400 items-center border-l border-r border-gray-600 mr-3 ml-1 sm:ml-10">
                <ArrowSmUpIcon
                  onClick={() => {
                    if (user) {
                      handleLike();
                    } else {
                      dispatch(setLoginVisible(true));
                    }
                  }}
                  className=" h-6 hover:text-red-500 cursor-pointer"
                />
                <p className=" px-1 font-bold text-sm text-white">
                  {post.upVotes - post.downVotes}
                </p>
                <ArrowSmDownIcon
                  onClick={() => {
                    if (user) {
                      handleDislike();
                    } else {
                      dispatch(setLoginVisible(true));
                    }
                  }}
                  className="h-6  hover:text-blue-500 cursor-pointer"
                />
              </div>
              <PhotographIcon className="hidden sm:inline-block h-6 w-6 text-gray-200 mr-1" />
              <p className="line-clamp-1 text-gray-200 flex-shrink flex-grow">
                {post.title}
              </p>
            </div>
            <div
              onClick={() => {
                navigate("/");
              }}
              className=" text-gray-300 flex pr-5 items-center cursor-pointer"
            >
              <XIcon className="h-5 w-5 " />
              <p className="hidden sm:inline-block">Close</p>
            </div>
          </div>
          <section className="flex space-x-5 p-5 justify-center text-sm">
            <section className="flex flex-col">
              <PostPageItem post={post} />
              {/* POST COMMENT SECTION    //////////////////////////////////////////////////////////////////////////////////////// */}
              <div className="mb-5">
                <TextareaAutosize
                  disabled={user ? false : true}
                  onChange={(event) => {
                    setCommentPost(event.target.value);
                  }}
                  className="w-full px-5 pt-3 border m-0 min-h-[10rem] "
                />
                <div className="bg-gray-100 w-full h-10 -mt-1.5 rounded-b-md flex items-center justify-end">
                  <button
                    onClick={() => {
                      if (user) {
                        handleSubmitComment(
                          true,
                          commentPost,
                          post.subredditId
                        );
                      } else {
                        dispatch(setLoginVisible(true));
                      }
                    }}
                    className={`${
                      user
                        ? ""
                        : "bg-gray-300 text-gray-400 hover:bg-gray-300 cursor-default"
                    } join-btn mr-5 `}
                  >
                    {user ? "Comment" : "Log in to Comment"}
                  </button>
                </div>
              </div>

              {/* SORTING SECTION    //////////////////////////////////////////////////////////////////////////////////////// */}

              <div className="relative my-5 w-[3rem]">
                <button
                  className="h-10 bg-blue-600 text-white font-bold rounded-md w-full"
                  onClick={() => setSortVisible(!sortVisible)}
                >
                  Sort
                </button>
                <div
                  className={` ${
                    sortVisible ? "inline-block" : "hidden"
                  }  text-gray-500 bg-white font-medium  shadow-md absolute top-full w-full rounded-md flex flex-col`}
                >
                  <a
                    href={`/r/${post?.subreddit?.name || "noName"}/comments/${
                      post.id
                    }/${
                      post?.title?.replaceAll(" ", "_") || "noTitle"
                    }?sortBy=upVotes&order=DESC`}
                    className="hover:text-gray-800 hover:bg-blue-200 p-2"
                  >
                    Top
                  </a>
                  <a
                    href={`/r/${post?.subreddit?.name || "noName"}/comments/${
                      post.id
                    }/${
                      post?.title?.replaceAll(" ", "_") || "noTitle"
                    }?sortBy=createdAt&order=DESC`}
                    className="hover:text-gray-800 hover:bg-blue-200 p-2"
                  >
                    New
                  </a>
                  <a
                    href={`/r/${post?.subreddit?.name || "noName"}/comments/${
                      post.id
                    }/${
                      post?.title?.replaceAll(" ", "_") || "noTitle"
                    }?sortBy=createdAt&order=ASC`}
                    className="hover:text-gray-800 hover:bg-blue-200 p-2"
                  >
                    Old
                  </a>
                </div>
              </div>

              {/* COMMENT SECTION    //////////////////////////////////////////////////////////////////////////////////////// */}

              <div className="max-w-[15rem] sm:max-w-[20rem] md:max-w-[25rem]">
                {post?.comments?.map((comment) => (
                  <div className="border-l border-gray-300 " key={comment.id}>
                    <div className="flex flex-col space-x-1 p-2">
                      <Avatar createdAt={comment.createdAt} />

                      <p className="p-1 pl-7">{comment.text}</p>
                      <CommentActionsBar comment={comment} post={post} />
                    </div>
                    {comment?.comments?.map((a) => (
                      <div className="border-l border-gray-300 translate-x-3 sm:translate-x-10 ">
                        <div className="flex flex-col space-x-1 p-2 ">
                          <Avatar createdAt={a.createdAt} />

                          <p className="p-1 pl-7">{a.text}</p>
                          <CommentActionsBar comment={a} post={post} />
                        </div>
                        {a?.comments?.map((b) => {
                          return (
                            <div className="border-l border-gray-300 translate-x-3 sm:translate-x-10 ">
                              <div className="flex flex-col space-x-1 p-2 ">
                                <Avatar createdAt={b.createdAt} />

                                <p className="p-1 pl-7">{b.text}</p>
                                <CommentActionsBar comment={b} post={post} />
                              </div>

                              {b?.comments?.map((c) => (
                                <div className="border-l border-gray-300 translate-x-3 sm:translate-x-10 ">
                                  <div className="flex flex-col space-x-1 p-2 ">
                                    <Avatar createdAt={c.createdAt} />

                                    <p className="p-1 pl-7">{c.text}</p>
                                    <CommentActionsBar
                                      comment={c}
                                      post={post}
                                    />
                                  </div>
                                  {c?.comments?.map((d) => {
                                    return (
                                      <div className="border-l border-gray-300 translate-x-3 sm:translate-x-10 ">
                                        <div className="flex flex-col space-x-1 p-2 ">
                                          <Avatar createdAt={d.createdAt} />

                                          <p className="p-1 pl-7">{d.text}</p>
                                          <CommentActionsBar
                                            comment={d}
                                            post={post}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            {/* SIDEBAR SECTION     RIGHT SIDE            //////////////////////////////////////////////////////////////////////////////////////////      */}
            <section className="hidden lg:flex flex-col items-center ">
              <div className="flex flex-col border rounded-sm pt-5 text-gray-800 border border-gray-300">
                <div className="p-2 flex flex-col space-y-3">
                  <div className=" font-bold flex space-x-5 items-center self-start">
                    <div className="rounded-full overflow-hidden h-[3rem] w-[3rem]">
                      <img src={f1} />
                    </div>
                    <p className="text-lg font-semibold">r/Suomi</p>{" "}
                  </div>
                  <p className="max-w-xs text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                  <div className="flex space-x-20 border-b pb-5">
                    <div className="">
                      <p className="font-bold">100k</p>
                      <p className="font-medium text-xs text-gray-800">
                        Members
                      </p>
                    </div>
                    <div className="">
                      <p className="font-bold">2k</p>
                      <p className="font-medium text-xs text-gray-800">
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="text-base font-normal">
                    created aug 27 2008
                  </div>
                  <button
                    onClick={() => {
                      if (user) {
                        /////////   join subreddit
                      } else {
                        dispatch(setLoginVisible(true));
                      }
                    }}
                    className="btn2"
                  >
                    Join
                  </button>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PostPage;
