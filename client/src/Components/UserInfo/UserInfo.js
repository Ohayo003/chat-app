import React, { useContext, useRef } from "react";
import "./UserInfo.css";
import { signOut } from "../Auth/AuthCall";
import MaleAvatar from "../../assets/images/male-chat-avatar.png";
import FemaleAvatar from "../../assets/images/female-chat-avatar.png";
import { AuthContext } from "../Auth/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import axios from "../../axios";
import { toast } from "react-toastify";

function UserInfo({ currentUser }) {
  const addContact = useRef();
  const newPassword = useRef();
  const confirmNewPassword = useRef();
  const { dispatch } = useContext(AuthContext);
  const contactModal = document.getElementById("modalAddContact");
  const myAccountModal = document.getElementById("modalMyAccount");

  //Logout current user
  const handleLogout = async (event) => {
    signOut(dispatch);
    io("ws://localhost:5000").disconnect();
    event.preventDefault();
  };

  const showModalForm = () => {
    contactModal.style.display = "block";
  };
  const showModalMyAccount = () => {
    myAccountModal.style.display = "block";
  };

  const closeModal = () => {
    contactModal.style.display = "none";
    myAccountModal.style.display = "none";
  };

  //Add new Contact
  const addFriendContact = async () => {
    const email = {
      email: addContact.current.value,
    };

    try {
      if (addContact.current.value === "") {
        toast.error("Please enter an email!");
      } else {
        const addUser = await axios.post("/api/chat/users/email", email);
        const friendId = {
          friendId: addUser.data._id,
        };
        if (currentUser.email !== addUser.data.email) {
          await axios
            .put(`/api/chat/users/friends/add/${currentUser._id}`, friendId)
            .then(async (response) => {
              const friendId = {
                friendId: response.data._id,
              };
              await axios.put(
                `/api/chat/users/friends/add/${addUser.data._id}`,
                friendId
              );
            });

          toast.success(`${addUser.data.name} has been added to your contacts`);
          addContact.current.value = "";
          closeModal();
          // window.location.reload(true);
        } else {
          toast.error(`Cannot add your self!`);
        }
      }
    } catch (error) {
      toast.error(`user with ${email.email} does not exist!`);
    }
  };

  //change the password of the current user
  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (newPassword.current.value === confirmNewPassword.current.value) {
      const newPass = {
        password: newPassword.current.value,
      };
      await axios
        .put(
          "/api/chat/users/account/change-password/" + currentUser._id,
          newPass
        )
        .then((response) => {
          if (!response) {
            toast.error("Something went wrong while updating password");
          }
          toast.success("password successfully updated!");
          closeModal();
        });
    } else {
      toast.error("password do not match!");
    }
  };

  return (
    <>
      <div className="userLogoContainer">
        <img
          className="userImg"
          src={currentUser.gender === "male" ? MaleAvatar : FemaleAvatar}
          alt=""
        />
        <div className="dropdown-content">
          <h4 style={{ marginTop: 2, color: "black" }}>{currentUser.name}</h4>
          <h6 onClick={showModalForm}>Add Contact</h6>
          <h6 onClick={showModalMyAccount}>Change Password</h6>
          <h6 onClick={handleLogout}>Sign out</h6>
        </div>
      </div>

      {/*  Add Contact Modal */}
      <div id="modalAddContact" className="modal">
        {/* Modal content */}
        <div className="modal-content">
          <div className="modal-header text-center">
            <p className="modal-title w-100 font-weight-bold">
              Add Contact using Email
            </p>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-body mx-3">
            <div className="md-form ">
              <label htmlFor="search" className="mb-2">
                Enter email of a friend
              </label>
              <input
                className="form-control"
                type="email"
                name="search"
                ref={addContact}
                placeholder="enter email of user..."
                required
              />
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="submit"
                onClick={addFriendContact}
                className="btn btn-info btn-sm w-50 btnAdd"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  Change Password Modal */}
      <div id="modalMyAccount" className="modal">
        {/* Modal content */}
        <div className="modal-content">
          <div className="modal-header text-center">
            <p className="modal-title w-100 font-weight-bold">
              Change Password
            </p>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-body mx-3">
            <div className="md-form">
              <label htmlFor="newPassowrd" className="mb-2">
                New Password
              </label>
              <input
                className="form-control"
                type="password"
                name="newPassword"
                ref={newPassword}
                placeholder="New Password"
                required
              />
            </div>
            <div className="md-form">
              <label htmlFor="confirmPassword" className="mt-2 mb-2">
                Confirm New Password
              </label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                ref={confirmNewPassword}
                placeholder="Confirm Password"
                required
              />
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="submit"
                onClick={handleChangePassword}
                className="btn btn-info btn-sm btnAdd"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
