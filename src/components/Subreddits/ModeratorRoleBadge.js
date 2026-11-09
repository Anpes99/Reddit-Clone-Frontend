import { SubredditModeratorRole } from "../../enums/subreddit.enum";

const ROLE_BADGES = {
  [SubredditModeratorRole.OWNER]: {
    label: "Owner",
    className: "bg-blue-100 text-blue-800",
  },
  [SubredditModeratorRole.MODERATOR]: {
    label: "Moderator",
    className: "bg-green-100 text-green-800",
  },
  [SubredditModeratorRole.MODERATOR_LIMITED]: {
    label: "Limited",
    className: "bg-gray-200 text-gray-700",
  },
};

const ModeratorRoleBadge = ({ role }) => {
  const badge = ROLE_BADGES[role];
  if (!badge) {
    return null;
  }
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
    >
      {badge.label}
    </span>
  );
};

export default ModeratorRoleBadge;
