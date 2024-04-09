import moment from "moment";
import f1 from "../../fake data/f1.png";

const Avatar = ({ createdAt }) => {
  const date = new Date(createdAt);

  return (
    <div className="flex space-x-2 items-center">
      <div className="rounded-full overflow-hidden h-5 w-5 sm:h-8 sm:w-8">
        <img src={f1} alt="user img" />
      </div>
      <div className="inline-block flex items-center text-xs font-medium  text-gray-900">
        User1{" "}
        <p className="font-sm ml-2 text-gray-500">
          {moment(date.getTime()).fromNow()}
        </p>
      </div>
    </div>
  );
};
export default Avatar;
