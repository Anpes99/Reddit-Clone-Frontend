import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../../app/slices/appSlice";

import SearchPageList from "./components/SearchPageList";
import { Link, useSearchParams } from "react-router";
const SearchPageContentSelectionButtons = ({
  itemsType,
  orderType,
  searchQuery,
}) => {
  return (
    <div className="flex pl-3">
      <Link
        to={`/search?type=posts&sort=${orderType}&searchquery=${encodeURIComponent(searchQuery ?? "")}`}
        className={`${
          itemsType === "posts" ? "bg-gray-300" : ""
        } pl-4 pr-4 py-2 rounded-3xl font-semibold mr-4 hover:underline`}
      >
        Posts
      </Link>
      <Link
        to={`/search?type=communities&searchquery=${encodeURIComponent(searchQuery ?? "")}`}
        className={`${
          itemsType === "communities" ? "bg-gray-300" : ""
        } pl-4 pr-4 py-2  rounded-3xl font-semibold hover:underline "`}
      >
        Communities
      </Link>
    </div>
  );
};

const SearchPage = () => {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const itemsType = searchParams.get("type") || "posts";
  const orderType = searchParams.get("sort") || "NEW";
  const searchQuery = searchParams.get("searchquery");

  return (
    <>
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="flex flex-row min-h-[calc(100dvh-var(--header-height))] justify-between bg-white pt-5 md:min-w-[700px]"
      >
        <div className=""></div>

        <div className="w-full  md:px-5 lg:pt-6 max-w-screen-lg">
          <SearchPageContentSelectionButtons
            itemsType={itemsType}
            orderType={orderType}
            searchQuery={searchQuery}
          />

          <div className="flex flex-col  w-full">
            <div className="flex justify-center lg:justify-between w-full mt-4">
              <SearchPageList />
            </div>
          </div>

          <div></div>
        </div>

        <div className=""></div>
      </div>
    </>
  );
};

export default SearchPage;
