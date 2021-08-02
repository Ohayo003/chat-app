import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import "../Register/Register.css";
import axios from "../../axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Auth/AuthContext";

export default function Register() {
  const { isFetching } = useContext(AuthContext);
  const registerName = useRef();
  const registerEmail = useRef();
  const registerPassword = useRef();
  const gender =['male', 'female'];
  const history = useHistory();
  let userGender = 'male'
  const genderType = gender.map(g => g);

  const handleChangeGenderType = (event) => {
    userGender = event.target.value;
  }
  const registerAccount = async (event) => {
    event.preventDefault();
    const createUser = {
      name: registerName.current.value,
      gender: userGender,
      email: registerEmail.current.value,
      password: registerPassword.current.value,
    };
    try {
      await axios.post("/api/register", createUser).then((response) => {
        if (response.status === 409) {
          toast.error(
            `Account ${createUser.email} already exist!`
          );
        }
        else if(!response){
          toast.error(`Something went wrong while creating the account`);
        }
        toast.info(
          `Account ${createUser.email} has been created successfully`
        );
        history.push("/");
      });
    } catch (error) {
      toast.error(`Account ${createUser.email} already exist!`);
    }
  };

  return (
    <div className="register container">
      <h1 className="py-5">WELCOME TO CHAT APP</h1>

      <div className="row justify-content-center">
        <div className="col col-md-4 registerContainer">
          <form className="form-group " onSubmit={registerAccount}>
            <h3>Create Account</h3>
            <div className="form-group inputRegisterDiv">
              <label htmlFor="nameInput" className="label">
                Name
              </label>
              <input
                type="text"
                id="nameInput"
                className="form-control"
                placeholder="Name"
                ref={registerName}
                required
              />
            </div>
            <div className="form-group inputRegisterDiv">
              <label htmlFor="gender" className="label">
                Gender:
              </label>
              <select id="gender" className="form-select" onChange={(event) => handleChangeGenderType(event)}>
                {
                  genderType.map((gender, key) => <option value={gender} key={key}>{gender}</option>)
                }
              </select>

            </div>

            <div className="form-group inputRegisterDiv">
              <label htmlFor="passwordInput" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="emailInput"
                className="form-control"
                placeholder="Email Address"
                ref={registerEmail}
                required
              />
            </div>
            <div className="form-group inputRegisterDiv">
              <label htmlFor="passwordInput" className="label">
                Password
              </label>
              <input
                type="password"
                id="passwordInput"
                className="form-control"
                placeholder="Password"
                ref={registerPassword}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-md buttonRegister mt-2"
            >
              {isFetching ? "Loading" : "Create Account"}
            </button>

            <p className="forgot-password text-right">
              Already registered <Link to="/">log in?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
