import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  XIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../components/Header";
import PostPageItem from "../components/PostPageItem";
import TopCommunities from "../components/TopCommunities";
import f1 from "../fake data/f1.png";
import moment from "moment";

const Avatar = ({ createdAt }) => {
  const date = new Date(createdAt);

  return (
    <div className="flex space-x-2 items-center">
      <div className="rounded-full overflow-hidden h-8 w-8">
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

const PostPage = () => {
  const [post, setPost] = useState({});
  const postId = useParams().postId;
  let comments;
  useEffect(async () => {
    const result = await axios.get(
      `/api/posts/${postId}?commentCommentAmount=10`
    );
    setPost(result.data);

    comments = result.data.comments[0].comments.map((comment) => (
      <div>{comment.text}</div>
    ));
    console.log(comments);
  }, []);

  return (
    <div className="">
      <Header />
      <div className="bg-gray-600">
        <main className=" max-w-screen-xl mx-auto bg-white">
          <div className="h-10 bg-black flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex text-gray-400 items-center border-l border-r border-gray-600 mr-3 ml-10">
                <ArrowSmUpIcon className=" h-10 hover:text-red-500" />
                <p className=" px-1 font-bold text-sm text-white">
                  {post.upVotes - post.downVotes}
                </p>
                <ArrowSmDownIcon className="h-10  hover:text-blue-500" />
              </div>
              <PhotographIcon className="h-6 w-6 text-gray-200 mr-1" />
              <p className="line-clamp-1 text-gray-200 flex-shrink flex-grow">
                {post.title}
              </p>
            </div>
            <div className="text-gray-300 flex pr-5 items-center">
              <XIcon className="h-5 w-5" />
              <p>Close</p>
            </div>
          </div>
          <section className="flex space-x-5 p-5 justify-center">
            <section className="flex flex-col">
              <PostPageItem post={post} />
              <div>
                {post?.comments?.map((comment) => (
                  <div className="border-l border-gray-300 " key={comment.id}>
                    <div className="flex flex-col space-x-1 p-2">
                      <Avatar createdAt={comment.createdAt} />

                      <p className="p-1 pl-7">{comment.text}</p>
                    </div>
                    {comment?.comments?.map((a) => (
                      <div className="border-l border-gray-300  translate-x-10 ">
                        <div className="flex flex-col space-x-1 p-2">
                          <Avatar createdAt={comment.createdAt} />

                          <p className="p-1 pl-7">{a.text}</p>
                        </div>
                        {a?.comments?.map((b) => {
                          return (
                            <div className="border-l border-gray-300  translate-x-10 ">
                              <div className="flex flex-col space-x-1 p-2">
                                <Avatar createdAt={comment.createdAt} />

                                <p className="p-1 pl-7">{b.text}</p>
                              </div>

                              {b?.comments?.map((c) => (
                                <div className="border-l border-gray-300  translate-x-10 ">
                                  <div className="flex flex-col space-x-1 p-2">
                                    <Avatar createdAt={comment.createdAt} />

                                    <p className="p-1 pl-7">{c.text}</p>
                                  </div>
                                  {c?.comments?.map((d) => {
                                    return (
                                      <div className="border-l border-gray-300  translate-x-10 ">
                                        <div className="flex flex-col space-x-1 p-2">
                                          <Avatar
                                            createdAt={comment.createdAt}
                                          />

                                          <p className="p-1 pl-7">{d.text}</p>
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
            <section className="hidden lg:block">
              <TopCommunities />
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PostPage;
