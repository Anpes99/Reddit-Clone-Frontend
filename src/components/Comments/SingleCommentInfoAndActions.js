import { useDispatch, useSelector } from "react-redux";
import CommentActionsBar from "./CommentActionsBar";
import Avatar from "./Avatar";

const SingleCommentInfoAndActions = ({ post, comment }) => {
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

export default SingleCommentInfoAndActions;
