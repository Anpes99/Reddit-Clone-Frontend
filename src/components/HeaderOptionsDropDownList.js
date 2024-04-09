import { useDispatch, useSelector } from "react-redux";
import { setLoginVisible, setUser } from "../slices/appSlice";

const HeaderOptionsDropDownList = ({ isVisible }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  return (
    <div
      className={`flex right-0  top-[9rem] sm:top-14 w-full sm:w-auto ${
        isVisible ? "" : "h-0 overflow-hidden"
      } absolute  flex-col bg-gray-50 text-sm font-medium select-none duration-200 z-[100]`}
    >
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
          onClick={() => {
            dispatch(setUser(null));
            localStorage.removeItem("loggedInRedditAppUser");
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
