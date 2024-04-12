import { XIcon, PhotographIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import PostPageMainInfoSection from "../components/PostPageItem";
import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../slices/appSlice";
import { useSearchParams } from "react-router-dom";
import SubredditInfo from "../components/SubredditInfo";
import { useSelector } from "react-redux";
import TopCommunities from "../components/TopCommunities";
import CreateNewDirectPostComment from "../components/Comments/CreateNewDirectPostComment";
import PostPageCommentsSortingSection from "../components/Comments/PostPageCommentsSortingSection";
import PostCommentsSection from "../components/Comments/PostCommentsSection";
import PostVotingArrows from "../components/PostVotingArrows";

const PostPage = () => {
  const navigate = useNavigate();
  const [commentPostMessageError, setCommentPostMessageError] = useState(false);
  const postId = useParams().postId;
  const [post, setPost] = useState({ id: Number(postId) });
  const [totalComments, setTotalComments] = useState(null);
  const [commentPostMessage, setCommentPostMessage] = useState(null);
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const dispatch = useDispatch();

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
                <PostVotingArrows post={post} numberColor="text-white" />
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
              <PostPageMainInfoSection
                post={post}
                totalComments={totalComments}
              />
              <div className="mb-5">
                <CreateNewDirectPostComment user={user} post={post} />
              </div>

              <div className={`relative my-5 w-full border-b p-1`}>
                <PostPageCommentsSortingSection post={post} />
              </div>

              <PostCommentsSection post={post} />
            </section>

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
