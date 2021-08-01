import React, { useState, useEffect } from "react";
import "./ContactInfo.css";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";
import axios from "../../axios";

function ContactInfo({ friendId,currentChat, currentUser, setCurrentChat }) {
  const [currentOpenChat, setCurrentOpenChat] = useState([]);

  useEffect(() => {
    const getContactName = async () => {
      try {
        await axios.get(`/api/chat/users/${friendId}`).then(response => {
          //console.log(response)
          setCurrentOpenChat(response.data);
        })
        
      } catch (error) {
        console.log(error);
      }
    };
    getContactName();
  }, [friendId, currentChat]);
  const handleCloseCurrentChat = () => {
    setCurrentChat(null);
  };

  return (
    <div className="userFriendInfoContainer">
      <div className="userFriendInfoLeft">
        <h6>{currentOpenChat.name}</h6>
      </div>
      <div className="userFriendInfoRight">
        <IconButton
          onClick={handleCloseCurrentChat}
          className="btn-hover"
          type="submit"
        >
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ContactInfo;
