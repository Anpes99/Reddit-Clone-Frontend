import { useDispatch } from "react-redux";
import Axios from "../shared/lib/axios";
import { addGlobalNotification, setUser } from "../app/slices/appSlice";

const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await Axios.post("/api/auth/logout");

      dispatch(setUser(null));

      window.location.href = "/";
    } catch (e) {
      dispatch(
        addGlobalNotification({
          message: "Couldn't log you out",
          type: "error",
        }),
      );
    }
  };

  return [logout];
};

export default useLogout;
