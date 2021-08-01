import { toast } from "react-toastify";
import axios from "../../axios";

export const signIn = async (userInfo, dispatch) => {
  dispatch({ type: "SIGNING_IN" });
  try {
    axios.defaults.withCredentials = true;
    const res = await axios.post("/api/login", userInfo);
    toast.success("You are Logged in!");
    dispatch({ type: "SIGN_IN_SUCCESS", payload: res.data });
  } catch (error) {
    toast.error("Invalid Email or Password");
    dispatch({ type: "SIGN_IN_FAILED", payload: error });
  }
};
export const signOut = async (dispatch) => {
  dispatch({ type: "SIGN_OUT" });
};
