import moment from "moment";
import UserAvatarImg from "../../../../components/Users/UserAvatarImg";
import UserHoverCard from "../../../../components/Users/UserHoverCard";

const Avatar = ({ comment }) => {
  const { createdAt } = comment;
  const date = new Date(createdAt);

  return (
    <div className="flex space-x-2 items-center">
      <UserHoverCard username={comment.user.username}>
        <div className="rounded-full overflow-hidden h-5 w-5 sm:h-8 sm:w-8 cursor-pointer">
          <UserAvatarImg url={comment.user.avatarImageUrl} />
        </div>
      </UserHoverCard>
      <div className="inline-block flex items-center text-xs font-medium  text-gray-900">
        <UserHoverCard username={comment.user.username}>
          <p className="cursor-pointer">{comment.user.username}</p>
        </UserHoverCard>{" "}
        <p className="font-sm ml-2 text-gray-500">
          {moment(date.getTime()).fromNow()}
        </p>
      </div>
    </div>
  );
};
export default Avatar;
