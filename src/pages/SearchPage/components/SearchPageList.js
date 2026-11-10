import { useRef } from "react";
import useGetSearchPageItems from "../../../hooks/useGetSearchPageItems";
import { Link, useNavigate, useSearchParams } from "react-router";
import { MenuItem, Select } from "@mui/material";
import { makeStringSafeForURL } from "../../../shared/utils/utils";
import moment from "moment";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";
import SubredditHoverCard from "../../../components/Subreddits/SubredditHoverCard";

const ListItemSubreddit = ({ subreddit }) => {
  return (
    <Link
      to={`/r/${subreddit?.name}`}
      className="border-b py-5  flex flex-row  items-center hover:bg-gray-100 rounded-md px-4"
    >
      <div className="inline-block flex justify-center items-center rounded-full overflow-hidden h-[48px] w-[48px] cursor-pointer flex-shrink-0">
        {subreddit?.iconUrl ? (
          <img src={subreddit?.iconUrl} alt="subreddit img" />
        ) : (
          <DefaultSubredditIcon />
        )}
      </div>
      <div className="flex flex-col ml-4 min-w-0 flex-1">
        <div className="flex flex-row mb-1.5 items-center">
          <p className="font-bold text-lg ">r/{subreddit?.name}</p>
        </div>
        <div className="mb-1.5">
          <p className="font-normal text-sm break-words">
            {subreddit?.description}
          </p>
        </div>
        <div>
          <p className="font-extralight text-sm">
            {subreddit?.memberCount} members · {subreddit.onlineUserCount}{" "}
            online
          </p>
        </div>
      </div>
    </Link>
  );
};

const ListItemPost = ({ post }) => {
  const date = new Date(post.createdAt);
  const { title } = post;
  return (
    <div className="relative border-b py-5  flex flex-row justify-between items-center hover:bg-gray-100 rounded-md px-4">
      {/* Covers the row; links can't nest, so inner links use z-10 to sit above it.
          Cant use onClick because it doesnt have the "open link in new tab" */}
      <Link
        to={`/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
          makeStringSafeForURL(post?.title) || "noTitle"
        }`}
        aria-label={title}
        className="absolute inset-0 rounded-md"
      />
      <div className="flex flex-col">
        <div className="flex flex-row mb-1.5 items-center">
          <SubredditHoverCard subredditName={post?.subreddit?.name}>
            <div className="relative z-10 inline-block flex justify-center items-center rounded-full overflow-hidden h-7 w-7 cursor-pointer flex-shrink-0">
              <img src={post.subreddit.iconUrl} alt="user img" />
            </div>
          </SubredditHoverCard>
          <SubredditHoverCard subredditName={post?.subreddit?.name}>
            <p className="relative z-10 font-semibold text-sm mr-1.5 ml-3">
              r/{post?.subreddit?.name}
            </p>
          </SubredditHoverCard>
          <p className="font-extralight text-sm">·</p>
          <p className="font-extralight text-sm ml-1.5">
            {moment(date.getTime()).fromNow()}
          </p>
        </div>
        <div className="mb-1.5">
          <p className="font-bold text-lg">{title}</p>
        </div>
        <div>
          <p className="font-extralight text-sm">
            {post.upVotes - post.downVotes} votes · {post.commentCount} comments
          </p>
        </div>
      </div>

      {post.imageUrl && (
        <img
          alt="post img"
          className="block w-[80px] md:w-[120px] h-[60px] md:h-[90px] object-cover rounded-md"
          src={post.imageUrl}
        />
      )}
    </div>
  );
};

const SearchPageList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderType = searchParams.get("sort") || "NEW";
  const itemsType = searchParams.get("type") || "posts";
  const searchQuery = searchParams.get("searchquery");

  const [fetchMoreItems, loading, items] = useGetSearchPageItems({
    queryParamSort: orderType,
    itemsType,
    searchQuery,
  });
  const observerRef = useRef();
  const lastItemRef = (node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreItems(orderType);
      }
    });
    if (node) observerRef.current.observe(node);
  };

  return (
    <div className=" w-full xl:w-[1024px] xl:max-w-full">
      {itemsType !== "communities" && (
        <div className="flex space-x-4 bg-white p-5 text-xs sm:text-sm mb-2 border border-gray-300 w-full">
          <Select
            value={orderType}
            onChange={(e) => {
              navigate(
                `/search?type=${itemsType}&sort=${e.target.value}&searchquery=${encodeURIComponent(searchQuery ?? "")}`,
              );
            }}
          >
            <MenuItem value={"NEW"}>New</MenuItem>
            <MenuItem value={"TOP"}>Top</MenuItem>
          </Select>
        </div>
      )}
      {!loading && items.length === 0 && (
        <div className="bg-white  px-4 py-12 text-center">
          <p className="font-semibold text-lg">
            No {itemsType === "communities" ? "communities" : "posts"} found
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Try different keywords or check your spelling.
          </p>
        </div>
      )}
      {items.map((item, i) => {
        if (i + 1 === items.length) {
          return (
            <div key={item.id} ref={lastItemRef}>
              {itemsType === "posts" ? (
                <ListItemPost post={item} />
              ) : (
                <ListItemSubreddit subreddit={item} />
              )}
            </div>
          );
        } else
          return itemsType === "posts" ? (
            <ListItemPost post={item} key={item.id} />
          ) : (
            <ListItemSubreddit subreddit={item} key={item.id} />
          );
      })}
    </div>
  );
};

export default SearchPageList;
