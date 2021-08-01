import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./Components/Login/Login";
import ChatHome from "./Components/ChatHome/ChatHome";
import Register from "./Components/Register/Register";
import React, { useContext } from "react";
import { AuthContext } from "./Components/Auth/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <Switch>
        <Route path="/chat">
          {user ? <ChatHome user={user} /> : <Register />}
        </Route>
        <Route exact path="/">
          {user ? <Redirect to="/chat" /> : <Login />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/chat" /> : <Register />}
        </Route>
      </Switch>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
