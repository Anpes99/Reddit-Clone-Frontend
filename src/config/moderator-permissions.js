import {
  SubredditModeratorRole,
  SubredditPermissions as P,
} from "../enums/subreddit.enum";

export const subredditRolePermissions = {
  [SubredditModeratorRole.OWNER]: Object.values(P),
  [SubredditModeratorRole.MODERATOR]: [
    P.POSTS_MANAGE,
    P.USERS_MANAGE,
    P.SETTINGS_MANAGE,
  ],
  [SubredditModeratorRole.MODERATOR_LIMITED]: [P.POSTS_MANAGE],
};

export const hasSubredditPermission = (role, permission) => {
  return subredditRolePermissions[role]?.includes(permission) ?? false;
};
