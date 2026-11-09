import { Link } from "react-router";
import { useSelector } from "react-redux";
import UserAvatarImg from "../../../components/Users/UserAvatarImg";
import ModeratorRoleBadge from "../../../components/Subreddits/ModeratorRoleBadge";

const SubredditModerators = ({ style }) => {
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const moderators = currentSubreddit?.moderators;

  if (!moderators?.length) {
    return null;
  }

  return (
    <div
      style={style}
      className="bg-white rounded-sm border border-gray-300 min-w-[330px] p-4"
    >
      <h3 className="font-semibold text-sm text-gray-600 uppercase tracking-wide mb-3">
        Moderators
      </h3>
      <ul className="flex flex-col gap-3">
        {moderators.map((moderator) => (
          <li key={moderator.username}>
            <Link
              to={`/user/${moderator.username}`}
              className="flex items-center gap-3 group"
            >
              <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden">
                <UserAvatarImg url={moderator.avatarImageUrl} size={"auto"} />
              </div>
              <p className="min-w-0 text-sm font-semibold truncate group-hover:underline">
                u/{moderator.username}
              </p>
              <ModeratorRoleBadge role={moderator.role} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubredditModerators;
