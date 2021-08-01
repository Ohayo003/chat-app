import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useRef } from "react";
import "./Login.css";
import { Route, Link } from "react-router-dom";
import Register from "../Register/Register";
import { signIn } from "../Auth/AuthCall";
import { AuthContext } from "../Auth/AuthContext";
import { CircularProgress } from '@material-ui/core'

const Login = () => {
    const {isFetching,dispatch} = useContext(AuthContext);
    const email = useRef();
    const password = useRef();

    const LoginAccount = async (event) => {
      event.preventDefault();
      signIn({email: email.current.value, password: password.current.value}, dispatch);
    };

    return (
      
      <div className="login container">
        <header>
          <h1 className="py-5">WELCOME TO CHAT APP</h1>
          
        </header>
        <div className="row justify-content-center">
          <div className="col col-md-4 loginContainer">
            <form className="form-group " onSubmit={LoginAccount}>
              <h3>Please Login</h3>
              <div className="form-group inputDiv">
                <label htmlFor="emailInput" className="label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailInput"
                  className="form-control"
                  placeholder="Enter email"
                  ref={email}
                  required
                />
              </div>

              <div className="form-group inputDiv">
                <label htmlFor="passwordInput" className="label">
                  Password
                </label>
                <input
                  type="password"
                  id="passwordInput"
                  className="form-control"
                  placeholder="Enter password"
                  ref={password}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-md mt-3 button">
                { isFetching ? <CircularProgress color="white" size="20px"/> : "Sign in"}
              </button>
              <Link to="/register">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-md button mt-2"
                  
                >
                  Sign up
                </button>
              </Link>
            </form>
          </div>
          <Route path="/forgot-password"></Route>
          <Route path="/register" component={Register} />
        </div>
      </div>
      
    );
}

export default Login;