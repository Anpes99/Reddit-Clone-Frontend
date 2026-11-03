const USER_NOTIFICATION_TYPES = Object.freeze({
  POST_REMOVED: "post_removed",
  IMAGE_REMOVED: "image_removed",
  POST_APPROVED: "post_approved",
  POST_REJECTED: "post_rejected",

  COMMUNITY_CREATED: "community_created",

  COMMENT_REPLY: "comment_reply",
  COMMENT_REMOVED: "comment_removed",

  NEW_FOLLOWER: "new_follower",
  POST_UPVOTE: "post_upvote",
  COMMENT_UPVOTE: "comment_upvote",

  MODERATION_WARNING: "moderation_warning",
  MODERATION_UPDATE: "moderation_update",

  COMMUNITY_CREATED: "community_created",

  SYSTEM: "system",
});

export const NotificationStyle = Object.freeze({
  error: [
    USER_NOTIFICATION_TYPES.POST_REJECTED,
    USER_NOTIFICATION_TYPES.POST_REMOVED,
    USER_NOTIFICATION_TYPES.IMAGE_REMOVED,
    USER_NOTIFICATION_TYPES.COMMENT_REMOVED,
  ],

  warning: [
    USER_NOTIFICATION_TYPES.MODERATION_WARNING,
    USER_NOTIFICATION_TYPES.MODERATION_UPDATE,
  ],

  success: [
    USER_NOTIFICATION_TYPES.POST_APPROVED,
    USER_NOTIFICATION_TYPES.COMMUNITY_CREATED,
  ],

  info: [
    USER_NOTIFICATION_TYPES.NEW_FOLLOWER,
    USER_NOTIFICATION_TYPES.POST_UPVOTE,
    USER_NOTIFICATION_TYPES.COMMENT_UPVOTE,
    USER_NOTIFICATION_TYPES.COMMENT_REPLY,
    USER_NOTIFICATION_TYPES.SYSTEM,
  ],
});

export const getNotificationSeverity = (type) => {
  for (const [severity, types] of Object.entries(NotificationStyle)) {
    if (types.includes(type)) {
      return severity;
    }
  }

  return "info";
};
