import { createContext } from "react";
import AuthReducer from "./AuthReducers";
import { useReducer } from "react";
import {useEffect} from 'react';

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("userCredentials")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);


  useEffect(() => {
    localStorage.setItem("userCredentials", JSON.stringify(state.user));
  },[state.user])

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
