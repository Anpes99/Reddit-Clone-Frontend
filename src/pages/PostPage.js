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
import PostPageItem, { Voting } from "../components/PostPageItem";
import f1 from "../fake data/f1.png";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../slices/appSlice";
import { useSearchParams } from "react-router-dom";
import { ChatIcon } from "@heroicons/react/outline";
import TextareaAutosize from "react-textarea-autosize";
import * as yup from "yup";
import SubredditInfo from "../components/SubredditInfo";
import { useSelector } from "react-redux";
import { setLoginVisible } from "../slices/appSlice";
import socket from "../websockets/posts";
import TopCommunities from "../components/TopCommunities";

const commentSchema = yup.object().shape({
  text: yup.string().min(1).required(),
  directReplyToPost: yup.boolean().required(),
  subredditId: yup.number().required(),
  postId: yup.number().required(),
});

const handleLikeComment = async (commentId, userId) => {
  socket.emit("likeComment", commentId, userId);
};
const handleDislikeComment = async (commentId, userId) => {
  socket.emit("dislikeComment", commentId, userId);
};

const CommentPostSection = ({ user, post }) => {
  const [commentPost, setCommentPost] = useState("");

  const [commentPostMessageError, setCommentPostMessageError] = useState(false);

  const [commentPostMessage, setCommentPostMessage] = useState(null);

  const dispatch = useDispatch();

  return (
    <div className="">
      <div>
        <TextareaAutosize
          value={commentPost}
          disabled={user ? false : true}
          onChange={(event) => {
            setCommentPost(event.target.value);
          }}
          className="w-full px-5 pt-3 border m-0 min-h-[10rem] "
        />

        <div className="bg-gray-100 w-full h-10 -mt-1.5 rounded-b-md flex items-center justify-end">
          <button
            onClick={async () => {
              if (user) {
                const res = await handleSubmitComment(
                  true,
                  commentPost,
                  post.subredditId,
                  post.id,
                  null,
                  user
                );
                console.log(res);
                if (res.success) {
                  setCommentPost("");
                  setCommentPostMessage("New comment created");
                  setTimeout(() => {
                    setCommentPostMessage(null);
                  }, 3000);
                } else {
                  setCommentPostMessage("Error while submitting comment");
                  setCommentPostMessageError(true);
                  setTimeout(() => {
                    setCommentPostMessage(null);
                    setCommentPostMessageError(null);
                  }, 3000);
                }
              } else {
                dispatch(setLoginVisible(true));
              }
            }}
            disabled={commentPost?.length < 1}
            className={`${
              user && commentPost?.length >= 1
                ? ""
                : "bg-gray-300 text-gray-400 hover:bg-gray-300 cursor-default"
            } join-btn mr-5 `}
          >
            {user ? "Comment" : "Log in to Comment"}
          </button>
        </div>
      </div>

      <p
        className={`${
          commentPostMessageError ? "text-red-600" : "text-green-600"
        } font-medium text-medium`}
      >
        {commentPostMessage && commentPostMessage}
      </p>
    </div>
  );
};

const SortingSection = ({ post }) => {
  const [sortVisible, setSortVisible] = useState(false);

  return (
    <div className="w-[3rem]">
      <button
        className="h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-md w-full"
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
          href={
            post.id
              ? `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
                  post?.title?.replaceAll(" ", "_") || "noTitle"
                }?sortBy=upVotes&order=DESC`
              : null
          }
          className="hover:text-gray-800 hover:bg-blue-200 p-2"
        >
          Top
        </a>
        <a
          href={
            post.id
              ? `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
                  post?.title?.replaceAll(" ", "_") || "noTitle"
                }?sortBy=createdAt&order=DESC`
              : null
          }
          className="hover:text-gray-800 hover:bg-blue-200 p-2"
        >
          New
        </a>
        <a
          href={
            post.id
              ? `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
                  post?.title?.replaceAll(" ", "_") || "noTitle"
                }?sortBy=createdAt&order=ASC`
              : null
          }
          className="hover:text-gray-800 hover:bg-blue-200 p-2"
        >
          Old
        </a>
      </div>
    </div>
  );
};

const handleSubmitComment = async (
  directReplyToPost,
  comment,
  subredditId,
  postId,
  commentId,
  user
) => {
  const data = {
    text: comment,
    directReplyToPost,
    subredditId: subredditId, // localstorage.getItem("...")
    postId: postId,
  };
  console.log(data);
  const result = commentSchema.isValid(data).then(async () => {
    if (commentId && !directReplyToPost) {
      data.commentId = commentId;
    }

    try {
      const result = await axios.post("/api/comments", data, {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      });
      console.log(result);
      return { success: true };
    } catch (e) {
      console.log(e.response);
      return { success: false };
    }
  });
  return result;
};

const Avatar = ({ createdAt }) => {
  const date = new Date(createdAt);

  return (
    <div className="flex space-x-2 items-center">
      <div className="rounded-full overflow-hidden h-5 w-5 sm:h-8 sm:w-8">
        <img src={f1} alt="user img" />
      </div>
      <div className="inline-block flex items-center text-xs font-medium  text-gray-900">
        Anpes99{" "}
        <p className="font-sm ml-2 text-gray-500">
          {moment(date.getTime()).fromNow()}
        </p>
      </div>
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
  user,
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
                commentId,
                user
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
            Send reply
          </button>
        </div>
      </div>
    </>
  );
};

const CommentActionsBar = ({ post, comment, user, dispatch }) => {
  const [newComment, setNewComment] = useState("");
  const [createCommentVisible, setCreateCommentVisible] = useState(false);
  const [likes, setLikes] = useState(comment.upVotes - comment.downVotes);

  socket.on("comment_received_likes", (commentId) => {
    if (commentId === comment.id) {
      setLikes(likes + 1);
    }
  });
  socket.on("comment_received_dislikes", (commentId) => {
    if (commentId === comment.id) {
      setLikes(likes - 1);
    }
  });

  return (
    <div className="flex flex-col">
      <div className="flex  sm:p-2 items-center space-x-1 text-gray-400 font-semibold text-xs">
        <ArrowSmUpIcon
          onClick={() => {
            if (user) {
              handleLikeComment(comment.id, user.id);
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="text-gray-400 w-4 hover:text-red-500 cursor-pointer"
        />
        <p className=" font-bold">{likes}</p>
        <ArrowSmDownIcon
          onClick={() => {
            if (user) {
              handleDislikeComment(comment.id, user.id);
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="w-4 text-gray-400 hover:text-blue-500 cursor-pointer"
        />
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
        user={user}
      />
    </div>
  );
};

const CommentUserInfo = ({ post, comment }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  return (
    <div className="flex flex-col items-start text-left space-x-1 p-2 ">
      <Avatar createdAt={comment.createdAt} />

      <p className="p-1 pl-7">{comment.text}</p>
      <CommentActionsBar
        comment={comment}
        post={post}
        user={user}
        dispatch={dispatch}
      />
    </div>
  );
};

const PostPage = () => {
  const navigate = useNavigate();
  const [commentPostMessageError, setCommentPostMessageError] = useState(false);

  const [post, setPost] = useState({});
  const [totalComments, setTotalComments] = useState(null);
  const [commentPostMessage, setCommentPostMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const dispatch = useDispatch();

  const postId = useParams().postId;

  const user = useSelector((state) => state.app.user);

  useEffect(async () => {
    let queryString = "";
    queryString = sortBy ? queryString + "&sortBy=" + sortBy : queryString;
    queryString = order ? queryString + "&order=" + order : queryString;
    const result = await axios.get(
      `/api/posts/${postId}?commentCommentAmount=10${queryString}`
    );
    setPost(result.data.post);
    setTotalComments(result.data.totalComments);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="bg-gray-600"
      >
        <main className=" max-w-screen-xl mx-auto bg-white min-h-screen">
          <div className="h-10 bg-black flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center">
              <div className="flex text-gray-400 items-center border-l border-r border-gray-600 mr-3 ml-1 sm:ml-10">
                <Voting post={post} numberColor="text-white" />
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
              <PostPageItem post={post} totalComments={totalComments} />
              {/* POST COMMENT SECTION    //////////////////////////////////////////////////////////////////////////////////////// */}
              <div className="mb-5">
                <CommentPostSection user={user} post={post} />
              </div>
              {/* SORTING SECTION    //////////////////////////////////////////////////////////////////////////////////////// */}

              <div className={`relative my-5 w-full border-b p-1`}>
                <SortingSection post={post} />
              </div>

              {/* COMMENT SECTION    //////////////////////////////////////////////////////////////////////////////////////// */}

              <div className="max-w-[15rem] sm:max-w-[20rem] md:max-w-[25rem] text-center">
                {post?.comments?.length <= 0 && (
                  <p className="text-gray-500">
                    This post doesn't have any comments.
                  </p>
                )}
                {post.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-l border-gray-300 "
                    key={comment.id}
                  >
                    <CommentUserInfo
                      post={post}
                      user={user}
                      comment={comment}
                    />
                    {comment?.comments?.map((a) => (
                      <div
                        key={a.id}
                        className="border-l border-gray-300 translate-x-3 sm:translate-x-10 "
                      >
                        <CommentUserInfo post={post} user={user} comment={a} />
                        {a?.comments?.map((b) => {
                          return (
                            <div
                              key={b.id}
                              className="border-l border-gray-300 translate-x-3 sm:translate-x-10 "
                            >
                              <CommentUserInfo
                                post={post}
                                user={user}
                                comment={b}
                              />

                              {b?.comments?.map((c) => (
                                <div
                                  key={c.id}
                                  className="border-l border-gray-300 translate-x-3 sm:translate-x-10 "
                                >
                                  <CommentUserInfo
                                    post={post}
                                    user={user}
                                    comment={c}
                                  />
                                  {c?.comments?.map((d) => {
                                    return (
                                      <div
                                        key={d.id}
                                        className="border-l border-gray-300 translate-x-3 sm:translate-x-10 "
                                      >
                                        <CommentUserInfo
                                          post={post}
                                          user={user}
                                          comment={d}
                                        />
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
            <section className="hidden lg:block ">
              <SubredditInfo style={{ marginBottom: "20px" }} />

              <TopCommunities />
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PostPage;
