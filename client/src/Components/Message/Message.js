import React, { useEffect, useState } from "react";
import "./Message.css";
import MaleAvatar from "../../assets/images/male-chat-avatar.png";
import FemaleAvatar from "../../assets/images/female-chat-avatar.png";
import axios from "../../axios";
import { format } from "timeago.js";

export default function Message({
  messages,
  own,
  currentUser,
  receiver,
}) {
  const [friend, setFriend] = useState([]);
  

  useEffect(() => {
    const getFriendData = async () => {
      await axios.get(`/api/chat/users/${receiver}`).then((response) => {
        setFriend(response.data.gender);
      });
    };
    getFriendData();
  }, [receiver]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            own
              ? currentUser.gender === "male"
                ? MaleAvatar
                : FemaleAvatar
              : friend === "male"
              ? MaleAvatar
              : FemaleAvatar
          }
          alt=""
        />
        <p className="messageText">{messages.text}</p>
      </div>
      <div className="messageBottom">{format(messages.createdAt)}</div>
    </div>
  );
}
