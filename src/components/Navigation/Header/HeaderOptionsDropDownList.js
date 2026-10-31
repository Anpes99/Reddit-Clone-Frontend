import { useDispatch, useSelector } from "react-redux";
import { setLoginVisible, setUser } from "../../../app/slices/appSlice";
import UserAvatarImg from "../../Users/UserAvatarImg";
import Axios from "../../../shared/lib/axios";

const HeaderOptionsDropDownList = ({ isVisible }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  return (
    <div
      className={`flex right-0   top-14 w-auto ${
        isVisible ? "" : "h-0 overflow-hidden"
      } absolute  flex-col bg-gray-50 text-sm font-medium select-none duration-200 z-[100]`}
    >
      {user && (
        <div
          onClick={() => {
            window.location.href = "/user/" + user.username;
          }}
          className="flex text-xs link"
        >
          <UserAvatarImg url={user.avatarImageUrl} size={"30px"} />{" "}
          <div className="ml-2">
            <p>Show profile</p>
            <p className="text-gray-500">u/{user.username}</p>
          </div>
        </div>
      )}
      <h4 className="p-2 text-xs text-gray-400">VIEW OPTIONS</h4>
      <a className="link">Dark Mode</a>
      <h4 className="p-2 text-xs text-gray-400">MORE STUFF</h4>
      <a className="link">Coins</a>
      <a className="link">Premium</a>
      <a className="link">Powerups</a>
      <a className="link">Talk</a>
      <a className="link">Predictions</a>
      <a className="link">Help Center</a>
      {!user && (
        <a
          onClick={() => {
            dispatch(setLoginVisible(true));
          }}
          className="link border-t"
        >
          Log In / Sign Up
        </a>
      )}

      {user && (
        <a
          onClick={async () => {
            await Axios.post("/api/auth/logout");

            dispatch(setUser(null));

            window.location.href = "/";
          }}
          className="link border-t"
        >
          Log Out
        </a>
      )}
    </div>
  );
};

export default HeaderOptionsDropDownList;
