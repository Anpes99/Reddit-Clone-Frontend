import { useSelector } from "react-redux";
import SingleCommentInfoAndActions from "./SingleCommentInfoAndActions";

const PostCommentsSection = ({ post }) => {
  const user = useSelector((state) => state.app.user);

  return (
    <div className="max-w-[15rem] sm:max-w-[20rem] md:max-w-[25rem] text-center">
      {post?.comments?.length <= 0 && (
        <p className="text-gray-500">This post doesn't have any comments.</p>
      )}
      {post.comments?.map((comment) => (
        <div
          key={comment.id}
          className="border-l border-gray-300 "
          key={comment.id}
        >
          <SingleCommentInfoAndActions
            post={post}
            user={user}
            comment={comment}
          />
          {comment?.comments?.map((a) => (
            <div
              key={a.id}
              className="border-l border-gray-300 translate-x-3 sm:translate-x-10 "
            >
              <SingleCommentInfoAndActions
                post={post}
                user={user}
                comment={a}
              />
              {a?.comments?.map((b) => {
                return (
                  <div
                    key={b.id}
                    className="border-l border-gray-300 translate-x-3 sm:translate-x-10 "
                  >
                    <SingleCommentInfoAndActions
                      post={post}
                      user={user}
                      comment={b}
                    />

                    {b?.comments?.map((c) => (
                      <div
                        key={c.id}
                        className="border-l border-gray-300 translate-x-3 sm:translate-x-10 "
                      >
                        <SingleCommentInfoAndActions
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
                              <SingleCommentInfoAndActions
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
  );
};

export default PostCommentsSection;
