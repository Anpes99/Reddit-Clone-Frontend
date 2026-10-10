import { useSelector } from "react-redux";

import SingleCommentAndCommentCommentsThread from "./SingleCommentAndChilrenCommentsThread";

const PostCommentsSection = ({ post }) => {
  const user = useSelector((state) => state.app.user);

  return (
    <div className="max-w-[15rem] sm:max-w-[20rem] md:max-w-[25rem] text-center">
      {post?.comments?.length <= 0 && (
        <p className="text-gray-500">This post doesn't have any comments.</p>
      )}
      {post.comments?.map((comment) => (
        <div key={comment.id} className=" border-gray-300 ">
          <SingleCommentAndCommentCommentsThread
            post={post}
            user={user}
            comment={comment}
          />
        </div>
      ))}
    </div>
  );
};

export default PostCommentsSection;
