import Header from "../components/Header";
import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../slices/appSlice";

import SearchPageList from "../components/Search/SearchPageList";
import { useSearchParams } from "react-router-dom";

const SearchPage = ({}) => {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const itemsType = searchParams.get("type") || "posts";
  const orderType = searchParams.get("sort") || "new";
  const searchQuery = searchParams.get("searchquery");

  const SearchPageContentSelectionButtons = () => {
    return (
      <div className="flex ">
        <a
          href={`/search?type=posts&sort=${orderType}&searchquery=${searchQuery}`}
          className={`${
            itemsType === "posts" ? "bg-gray-300" : ""
          } pl-4 pr-4 py-2 rounded-3xl font-semibold mr-4 hover:underline`}
        >
          Posts
        </a>
        <a
          href={`/search?type=communities&searchquery=${searchQuery}`}
          className={`${
            itemsType === "communities" ? "bg-gray-300" : ""
          } pl-4 pr-4 py-2  rounded-3xl font-semibold hover:underline "`}
        >
          Communities
        </a>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="flex flex-row min-h-screen justify-between bg-white"
      >
        <div className=""></div>

        <div className="w-full  md:px-5 lg:pt-6 max-w-screen-lg">
          <SearchPageContentSelectionButtons />

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
