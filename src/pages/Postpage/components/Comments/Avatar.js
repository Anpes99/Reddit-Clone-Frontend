import moment from "moment";
import { useNavigate } from "react-router";
import UserAvatarImg from "../../../../components/Users/UserAvatarImg";

const Avatar = ({ comment }) => {
  const { createdAt } = comment;
  const date = new Date(createdAt);
  const navigate = useNavigate();

  return (
    <div className="flex space-x-2 items-center">
      <div
        onClick={() => {
          navigate(`/user/${comment.user.username}`);
        }}
        className="rounded-full overflow-hidden h-5 w-5 sm:h-8 sm:w-8 cursor-pointer"
      >
        <UserAvatarImg url={comment.user.avatarImageUrl} />
      </div>
      <div className="inline-block flex items-center text-xs font-medium  text-gray-900">
        <p
          onClick={() => {
            navigate(`/user/${comment.user.username}`);
          }}
          className="cursor-pointer"
        >
          {comment.user.username}
        </p>{" "}
        <p className="font-sm ml-2 text-gray-500">
          {moment(date.getTime()).fromNow()}
        </p>
      </div>
    </div>
  );
};
export default Avatar;
