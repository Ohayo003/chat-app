import React, { useEffect, useState } from "react";
import "./ContactList.css";
import MaleAvatar from "../../assets/images/male-chat-avatar.png";
import FemaleAvatar from "../../assets/images/female-chat-avatar.png";
import axios from "../../axios";
import { IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { toast } from "react-toastify";

function ContactList({
  friendData,
  currentUser,
  setFriendId,
  onlineUsers,
  setReceiver,
  setCurrentChat,
}) {
  const [userContact, setUserContact] = useState([]);
  const [isOnline, setIsOnline] = useState(false);

  //Delete a friend
  const handleDeleteContact = async (friend) => {
    const friendId = {
      friendId: friend,
    };
    try {
      await axios.put("/api/chat/users/friends/" + currentUser._id, friendId);
      const userId = {
        friendId: currentUser._id,
      };
      await axios.put("/api/chat/users/friends/" + friend, userId);
      setCurrentChat("");
      toast.success(`you deleted your friend ${friend.name}`);
    } catch (error) {
      toast.error(error);
    }
  };

  //Delete all the conversation messages of the friend and the user
  const handleDeleteMessages = async (friend) => {
    try {
      const getMessages = await axios.get(
        `/api/chat/conversation/getConversation/${currentUser._id}/${friend._id}`
      );
      await axios
        .delete(`/api/chat/messages/${getMessages.data._id}`)
        .then((response) => {
          if (!response) {
            console.log(`There are currently no messages with ${friend.name}`);
          }
          toast.info(
            `Conversation messages with ${friend.name} has been deleted.`
          );
          setCurrentChat("");
        });
    } catch (error) {
      console.log(error);
    }
  };

  //Get friends data
  useEffect(() => {
    const getFriendData = async () => {
      try {
        const response = await axios.get("/api/chat/users/" + friendData);
        setUserContact(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriendData();
  }, [friendData]);

  useEffect(() => {
    onlineUsers.map((element) => {
      element.userId === userContact._id
        ? setIsOnline(true)
        : setIsOnline(false);

      return isOnline;
    });
  }, [isOnline, userContact._id, onlineUsers]);

  //Get the conversation of the user to a friend if exist and if not
  //add new Conversation of the user and the friend
  const handleClick = async (receiverID) => {
    const newConversation = {
      senderId: currentUser._id,
      receiverId: receiverID,
    };
    setReceiver(receiverID);
    setFriendId(receiverID);
    try {
      await axios
        .get(
          `/api/chat/conversation/getConversation/${currentUser._id}/${receiverID}`
        )
        .then((response) => {
          if (response.data === null) {
            axios
              .post("/api/chat/conversation", newConversation)
              .then((response) => {
                setCurrentChat(response.data);
              });
          }
          setCurrentChat(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="ContactsContainer"
      onClick={() => handleClick(userContact._id)}
    >
      <div className="OnlineContacts">
        <div className="contactsImageContainer">
          <img
            className="onlineContactsImage"
            src={userContact.gender === "male" ? MaleAvatar : FemaleAvatar}
            alt=""
          />
          {isOnline ? <div className="contactsOnlineBadge"></div> : null}
        </div>
      </div>
      <span className="contactOnlineName">{userContact.name}</span>
      <div className="dropdown">
        <IconButton>
          <MoreVertIcon
            type="button"
            className="data-toggle"
            id="dropdownUserMenu"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            color="primary"
          />
        </IconButton>
        <div className="dropdown-menu" aria-labelledby="dropdownUserMenu">
          <h6
            className="dropdown-item"
            onClick={() => handleDeleteMessages(userContact)}
          >
            Delete Conversation
          </h6>
          <h6
            className="dropdown-item"
            onClick={() => handleDeleteContact(userContact._id)}
          >
            Remove Friend
          </h6>
        </div>
      </div>
    </div>
  );
}

export default ContactList;
