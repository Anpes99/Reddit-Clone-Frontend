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
  const index = user?.ratedPosts?.findIndex((p) => p.id === post.id);

  const currentRating = user?.ratedPosts?.[index]?.rating;
  let pointsToAdd = null;
  switch (currentRating) {
    case 1:
      pointsToAdd = -1;
      break;
    case -1:
      pointsToAdd = 2;
      break;
    default:
      pointsToAdd = 1;
      break;
  }

  const newRating = currentRating === 1 ? 0 : 1;
  let a;
  socket.emit(
    "likePost",
    post.id,
    user.id,
    newRating,
    pointsToAdd,
    async (data) => {
      a = data;
      if (data.success) {
        const updatedUser = { ...user };
        updatedUser.ratedPosts = await createOrUpdateObjInListById(
          updatedUser.ratedPosts,
          { id: post.id, rating: newRating }
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
export const handleDislikePost = async (post, user, dispatch) => {
  const index = user?.ratedPosts?.findIndex((p) => p.id === post.id);

  const currentRating = user?.ratedPosts?.[index]?.rating;
  let pointsToAdd = null;
  switch (currentRating) {
    case 1:
      pointsToAdd = -2;
      break;
    case -1:
      pointsToAdd = 1;
      break;
    default:
      pointsToAdd = -1;
      break;
  }

  const rating = currentRating === -1 ? 0 : -1;
  let a;
  await socket.emit(
    "dislikePost",
    post.id,
    user.id,
    rating,
    pointsToAdd,
    async (data) => {
      a = data;
      if (data.success) {
        const updatedUser = { ...user };
        updatedUser.ratedPosts = await createOrUpdateObjInListById(
          updatedUser.ratedPosts,
          { id: post.id, rating }
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
