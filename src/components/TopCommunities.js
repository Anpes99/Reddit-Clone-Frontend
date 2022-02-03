import { ChevronUpIcon } from "@heroicons/react/solid";
import f1 from "../fake data/f1.png";
import halo from "../fake data/halo.png";
import skyrim from "../fake data/skyrim.png";
import wfyd from "../fake data/wfyd.jpg";
import wm from "../fake data/wm.png";

const TopCommunities = () => {
  return (
    <div className="w-80 bg-white rounded-t-md relative">
      <div className=" h-20 bg-blue-500 rounded-t-md flex items-end p-1 pl-4">
        <h3 className="text-white z-20 font-semibold text-lg">
          Top News Communities
        </h3>
        <div className="absolute top-0 left-0 z-10 h-20 w-full bg-gradient-to-t from-black to-white opacity-50 rounded-t-md"></div>
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
          <button className="join-btn">Join</button>
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
          <button className="join-btn">Join</button>
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
          <button className="join-btn">Join</button>
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
          <button className="join-btn">Join</button>
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
          <button className="join-btn">Join</button>
        </div>
      </div>
    </div>
  );
};

export default TopCommunities;
