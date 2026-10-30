import axios from "axios";
import { setUser } from "../../app/slices/appSlice";
import Axios from "../lib/axios";
import socket from "../lib/socket";

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
      }
    },
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
          { id: post.id, rating: data.newRating },
        );
        dispatch(setUser(updatedUser));
      }
    },
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

export const uploadImageToS3 = async (imgFile) => {
  const getRegion = (url) => {
    try {
      const hostname = new URL(url).hostname;

      const match = hostname.match(
        /^s3[.-]([a-z0-9-]+)\.amazonaws\.com(?:\.cn)?$/,
      );

      if (match) return match[1];

      return null;
    } catch {
      return null;
    }
  };

  const res = await Axios.get("/api/utils/s3Url");
  const s3Data = res.data.url;

  const formData = new FormData();

  Object.entries(s3Data.fields || {}).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (!s3Data.fields?.key) {
    formData.append("key", s3Data.key);
  }

  formData.append("file", imgFile);

  await axios.post(s3Data.url, formData);

  const region = getRegion(s3Data.url);

  if (!region) {
    throw new Error("Could not determine S3 region");
  }

  return `https://${s3Data.fields.bucket}.s3.${region}.amazonaws.com/${s3Data.key}`;
};
