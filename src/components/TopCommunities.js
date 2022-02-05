import { ChevronUpIcon } from "@heroicons/react/solid";
import f1 from "../fake data/f1.png";
import halo from "../fake data/halo.png";
import skyrim from "../fake data/skyrim.png";
import wfyd from "../fake data/wfyd.jpg";
import wm from "../fake data/wm.png";
import { useDispatch, useSelector } from "react-redux";
import { setLoginVisible } from "../slices/appSlice";

const TopCommunities = () => {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

  const JoinButton = () => {
    return (
      <button
        onClick={() => {
          if (user) {
            /////////   join subreddit
          } else {
            dispatch(setLoginVisible(true));
          }
        }}
        className="join-btn"
      >
        Join
      </button>
    );
  };

  return (
    <div className="w-80 bg-white rounded-t-sm relative border border-gray-300">
      <div className=" h-20 bg-blue-200 rounded-t-sm flex items-end p-1 pl-4">
        <h3 className="text-white z-20 font-semibold text-lg">
          Top News Communities
        </h3>
        <div className="absolute top-0 left-0 z-10 h-20 w-full bg-gradient-to-t from-black to-white opacity-50 rounded-t-sm"></div>
      </div>

      <div>
        <div className="cursor-pointer border-b flex justify-between space-x-3 pr-3 items-center py-3   font-semibold text-lg text-black">
          <div className="flex items-center space-x-3 ml-5">
            <p className="w-3">1</p>
            <ChevronUpIcon className="h-6 text-green-400" />
            <div className="rounded-full overflow-hidden h-8 w-8">
              <img src={skyrim} />
            </div>
          </div>
          <p className="text-xs w-1/2 truncate">r/Skyrim</p>
          <JoinButton />
        </div>

        <div className="cursor-pointer border-b flex justify-between space-x-3 pr-3 items-center py-3   font-semibold text-lg text-black">
          <div className="flex items-center space-x-3 ml-5">
            <p className="w-3">2</p>
            <ChevronUpIcon className="h-6 text-green-400" />
            <div className="rounded-full overflow-hidden h-8 w-8">
              <img src={wfyd} />
            </div>
          </div>
          <p className="text-xs w-1/2 truncate">r/WhatsWrongWithYourDog</p>
          <JoinButton />
        </div>

        <div className="cursor-pointer border-b flex justify-between space-x-3 pr-3 items-center py-3   font-semibold text-lg text-black">
          <div className="flex items-center space-x-3 ml-5">
            <p className="w-3">3</p>
            <ChevronUpIcon className="h-6 text-green-400" />
            <div className="rounded-full overflow-hidden h-8 w-8">
              <img src={halo} />
            </div>
          </div>
          <p className="text-xs w-1/2 truncate">r/Halo</p>
          <JoinButton />
        </div>

        <div className="cursor-pointer border-b flex justify-between space-x-3 pr-3 items-center py-3   font-semibold text-lg text-black">
          <div className="flex items-center space-x-3 ml-5">
            <p className="w-3">4</p>
            <ChevronUpIcon className="h-6 text-green-400" />
            <div className="rounded-full overflow-hidden h-8 w-8">
              <img src={wm} />
            </div>
          </div>
          <p className="text-xs w-1/2 truncate">r/WholesomeMemes</p>
          <JoinButton />
        </div>

        <div className="cursor-pointer border-b flex justify-between space-x-3 pr-3 items-center py-3   font-semibold text-lg text-black">
          <div className="flex items-center space-x-3 ml-5">
            <p className="w-3">5</p>
            <ChevronUpIcon className="h-6 text-green-400" />
            <div className="rounded-full overflow-hidden h-8 w-8">
              <img src={f1} />
            </div>
          </div>
          <p className="text-xs w-1/2 truncate">r/F1</p>
          <JoinButton />
        </div>
      </div>
    </div>
  );
};

export default TopCommunities;
