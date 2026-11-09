import { useState } from "react";
import { Link } from "react-router";
import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/outline";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";
import ModeratorRoleBadge from "../../../components/Subreddits/ModeratorRoleBadge";

const Title = ({ count }) => (
  <>
    Moderated communities{" "}
    <span className="font-normal text-gray-600">({count})</span>
  </>
);

const ModeratedCommunitiesList = ({ moderatedSubreddits }) => (
  <ul className="flex flex-col gap-3">
    {moderatedSubreddits.map((subreddit) => (
      <li key={subreddit.name}>
        <Link
          to={`/r/${subreddit.name}`}
          className="flex items-center gap-3 group"
        >
          <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
            {subreddit.iconUrl ? (
              <img
                src={subreddit.iconUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <DefaultSubredditIcon />
            )}
          </div>
          <p className="min-w-0 text-sm font-semibold truncate group-hover:underline">
            r/{subreddit.name}
          </p>
          <ModeratorRoleBadge role={subreddit.role} />
        </Link>
      </li>
    ))}
  </ul>
);

const ModeratedCommunities = ({
  moderatedSubreddits,
  className = "",
  collapsible = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!moderatedSubreddits?.length) {
    return null;
  }

  if (collapsible) {
    return (
      <div
        className={`w-full bg-[#f6f8f9] rounded-3xl overflow-hidden ${className}`}
      >
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center h-[50px] px-4 font-bold text-lg justify-between"
        >
          <span className="text-left">
            <Title count={moderatedSubreddits.length} />
          </span>
          {expanded ? (
            <ArrowSmUpIcon className="h-7" />
          ) : (
            <ArrowSmDownIcon className="h-7" />
          )}
        </button>
        <div
          className="grid transition-all duration-200"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div
            className="overflow-hidden transition-opacity duration-300"
            style={{ opacity: expanded ? 1 : 0 }}
            // React 18 needs inert as a string; switch to inert={!expanded} on React 19
            inert={expanded ? undefined : "inert"}
          >
            <div className="px-4 pt-2 pb-4">
              <ModeratedCommunitiesList
                moderatedSubreddits={moderatedSubreddits}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#f6f8f9] rounded-xl p-4 ${className}`}>
      <h3 className="font-bold text-sm mb-3">
        <Title count={moderatedSubreddits.length} />
      </h3>
      <ModeratedCommunitiesList moderatedSubreddits={moderatedSubreddits} />
    </div>
  );
};

export default ModeratedCommunities;
