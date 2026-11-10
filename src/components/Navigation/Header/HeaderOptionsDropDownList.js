import { useDispatch, useSelector } from "react-redux";
import {
  setHeaderDropDownVisible,
  setLoginVisible,
} from "../../../app/slices/appSlice";
import UserAvatarImg from "../../Users/UserAvatarImg";
import useLogout from "../../../hooks/useLogout";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";

const HeaderOptionsDropDownList = ({ isVisible, toggleRef }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const [logout] = useLogout();
  const navigate = useNavigate();

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleRef?.current?.contains(event.target)) return;
      if (ref.current && !ref.current.contains(event.target)) {
        dispatch(setHeaderDropDownVisible(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, toggleRef]);

  return (
    <div
      ref={ref}
      className={`flex right-0   top-14 w-auto ${
        isVisible ? "" : "h-0 overflow-hidden"
      } absolute  flex-col bg-gray-50 text-sm font-medium select-none duration-200 z-[100]`}
    >
      {user && (
        <div
          onClick={() => {
            dispatch(setHeaderDropDownVisible(false));
            navigate("/user/" + user.username);
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
        <a onClick={logout} className="link border-t">
          Log Out
        </a>
      )}
    </div>
  );
};

export default HeaderOptionsDropDownList;
