import { setUser } from "../slices/appSlice";
import socket from "../websockets/posts";

export const createOrUpdateObjInListById = (arr, obj) => {
  const newArr = [...arr];
  const index = arr.findIndex((o) => o.id === obj.id);

  if (index !== -1) {
    if (obj.rating === 0) {
      return arr.filter((obj1) => obj1.id !== obj.id);
    } else {
      newArr[index] = obj;
    }
  } else {
    newArr.push(obj);
  }

  return newArr;
};

export const handleLikeComment = async (commentId, userId) => {
  socket.emit("likeComment", { commentId, userId });
};
export const handleDislikeComment = async (commentId, userId) => {
  socket.emit("dislikeComment", { commentId, userId });
};

export const handleLikePost = async (post, user, dispatch) => {
  let a;
  socket.emit(
    "likePost",
    {
      postId: post.id,
      userId: user.id,
    },
    async (data) => {
      a = data;
      if (data.success) {
        const updatedUser = { ...user };
        updatedUser.ratedPosts =
          data.newRating === 0
            ? updatedUser.ratedPosts.filter((p) => p.id !== post.id)
            : await createOrUpdateObjInListById(updatedUser.ratedPosts, {
                id: post.id,
                rating: data.newRating,
              });
        dispatch(setUser(updatedUser));
        localStorage.setItem(
          "loggedInRedditAppUser",
          JSON.stringify(updatedUser)
        );
      }
    }
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a);
    }, 3000);
  });
};
export const handleDislikePost = async (post, user, dispatch) => {
  let a;
  await socket.emit(
    "dislikePost",
    {
      postId: post.id,
      userId: user.id,
    },
    async (data) => {
      a = data;
      if (data.success) {
        const updatedUser = { ...user };
        updatedUser.ratedPosts = await createOrUpdateObjInListById(
          updatedUser.ratedPosts,
          { id: post.id, rating: data.newRating }
        );
        dispatch(setUser(updatedUser));
        localStorage.setItem(
          "loggedInRedditAppUser",
          JSON.stringify(updatedUser)
        );
      }
    }
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a);
    }, 3000);
  });
};

export const makeStringSafeForURL = (input, { maxLen = 140 } = {}) => {
  if (input == null) return "";
  let s = String(input).trim();

  // Normalize Unicode (avoid duplicates from accents/codepoints)
  s = s.normalize("NFC");

  // Replace punctuation with words
  const map = {
    "?": "question",
    "!": "exclamation",
    "&": "and",
    "%": "percent",
    "#": "hash",
    "/": "slash",
    "\\": "backslash",
    ":": "colon",
    ";": "semicolon",
    ",": "comma",
    ".": "dot",
    "@": "at",
    "+": "plus",
    "=": "equals",
    "<": "lt",
    ">": "gt",
    '"': "quote",
    "'": "apos",
    "`": "backtick",
    "~": "tilde",
    "*": "star",
  };

  s = s
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");

  // Convert spaces/underscores to dashes
  s = s.replace(/[_\s]+/g, "-");

  // Remove disallowed chars (keep letters, numbers, dash)
  s = s.replace(/[^-\p{L}\p{N}]/gu, "");

  // Collapse multiple dashes
  s = s.replace(/-+/g, "-");

  // Trim dashes and lowercase
  s = s.replace(/^-+|-+$/g, "").toLowerCase();

  // Enforce max length
  return s.slice(0, maxLen);
};
