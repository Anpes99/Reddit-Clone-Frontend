import { useCallback, useRef, useState } from "react";
import useGetSearchPageItems from "../../hooks/useGetSearchPageItems";
import { useSearchParams } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import f1 from "../../fake data/f1.png";
import { makeStringSafeForURL } from "../../utils/utils";
import moment from "moment";

const ListItemSubreddit = ({ subreddit }) => {
  return (
    <a
      href={`/r/${subreddit?.name}`}
      className="border-b py-5  flex flex-row  items-center hover:bg-gray-100 rounded-md px-4"
    >
      <div className="inline-block rounded-full overflow-hidden h-[48px] w-[48px] cursor-pointer flex-shrink-0">
        <img src={f1} alt="user img" />
      </div>
      <div className="flex flex-col ml-4">
        <div className="flex flex-row mb-1.5 items-center">
          <p className="font-bold text-lg ">r/{subreddit?.name}</p>
        </div>
        <div className="mb-1.5">
          <p className="font-normal text-sm">{subreddit?.description}</p>
        </div>
        <div>
          <p className="font-extralight text-sm">100 members · 123 online</p>
        </div>
      </div>
    </a>
  );
};

const ListItemPost = ({ post }) => {
  const date = new Date(post.createdAt);
  const { title } = post;
  return (
    <a
      href={`/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
        makeStringSafeForURL(post?.title) || "noTitle"
      }`}
      className="border-b py-5  flex flex-row justify-between items-center hover:bg-gray-100 rounded-md px-4"
    >
      <div className="flex flex-col">
        <div className="flex flex-row mb-1.5 items-center">
          <div className="inline-block rounded-full overflow-hidden h-7 w-7 cursor-pointer flex-shrink-0">
            <img src={f1} alt="user img" />
          </div>
          <p className="font-semibold text-sm mr-1.5 ml-3">
            r/{post?.subreddit?.name}
          </p>
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
            {post.upVotes - post.downVotes} votes · 100 comments
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
    </a>
  );
};

const SearchPageList = ({}) => {
  const [searchParams] = useSearchParams();
  const orderType = searchParams.get("sort") || "new";
  const itemsType = searchParams.get("type") || "posts";
  const searchQuery = searchParams.get("searchquery");

  const [fetchMoreItems, loading, items] = useGetSearchPageItems({
    queryParamSort: orderType,
    itemsType,
    searchQuery,
  });
  const observer = useRef();
  const lastItemRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreItems(orderType);
      }
    });
    if (node) observer.current.observe(node);
  });

  return (
    <div className="pr-0 lg:pr-7 w-full">
      {itemsType !== "communities" && (
        <div className="flex space-x-4 bg-white p-5 text-xs sm:text-sm mb-2 border border-gray-300 w-full">
          <Select
            value={orderType}
            onChange={(e) => {
              window.location.href = `/search?type=${itemsType}&sort=${e.target.value}&searchquery=${searchQuery}`;
            }}
          >
            <MenuItem value={"new"}>New</MenuItem>
            <MenuItem value={"top"}>Top</MenuItem>
          </Select>
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
