import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import "../ChatHome/ChatHome.css";
import "bootstrap/dist/css/bootstrap.css";
import ContactsInfo from "../ContactsInfo/ContactInfo";
import { io } from "socket.io-client";
import Message from "../Message/Message";
import ContactList from "../Contacts/ContactList";
import { AuthContext } from "../Auth/AuthContext";
import axios from "../../axios";
import UserInfo from "../UserInfo/UserInfo";
import { toast } from "react-toastify";
import notifSound from "../../assets/sounds/pristine-609.mp3";
import { Fab } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

export default function ChatHome() {
  
  const { user } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState("");
  const [friendId, setFriendId] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendData, setFriendData] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const [messages, setMessages] = useState([]);
  const [textMesasge, setTextMessage] = useState([]);
  const receiverEmail = useRef();
  const [newMessage, setNewMessage] = useState(null);
  const newMessageView = useRef();
  const socket = useRef();
  const showComposeMessageModal = document.getElementById(
    "modalComposeMessage"
  );

  const soundNotification = useMemo(() => {
    return new Audio(notifSound);
  }, []);

  axios.defaults.withCredentials = true;

  //Show Compose modal form
  const showModal = () => {
    showComposeMessageModal.style.display = "block";
  };
  //Close Compose modal form
  const closeModal = () => {
    showComposeMessageModal.style.display = "none";
  };

  //Play a sound for notification
  const playSound = (audioFiles) => {
    audioFiles.play();
  };

  //Update the view of the chat window to scroll down to a new message
  const executScrollView = () => {
    newMessageView.current.scrollIntoView({ behavior: "smooth" });
  };

  //Get the array of ID's of the user's friends and put it on the setFriendData array variable
  useEffect(() => {
    const getUserFriends = async () => {
      try {
        const userFriends = await axios.get("/api/chat/users/" + user._id);
        setFriendData(userFriends.data.friends);
      } catch (error) {
        console.log(error);
      }
    };
    getUserFriends();
  }, [user._id]);

  //Get the messages from the sender and initializes the socket
  useEffect(() => {
    socket.current = io("ws://localhost:5000");

    socket.current.on("getMessage", (messageData) => {
      axios.get(`/api/chat/users/${messageData.senderId}`).then((response) => {
        playSound(soundNotification);
        toast.info(`${response.data.name} sent you a mesasge.`);
      });
      setNewMessage({
        sender: messageData.senderId,
        text: messageData.message,
        createdAt: Date.now(),
      });
    });
  }, [soundNotification]);

  //Update the message conversation
  useEffect(() => {
    newMessage &&
      currentChat?.members.includes(newMessage.sender) &&
      setMessages((messages) => [...messages, newMessage]);
  }, [newMessage, currentChat]);

  //Connect the user to the socket
  useEffect(() => {
    socket.current.emit("user", user._id);
    socket.current.on("users", (users) => {
      setOnlineUsers(users);
    });
  }, [user._id]);

  //Send Message to a friend
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const conversationMessage = {
      conId: currentChat._id,
      sender: user._id,
      text: sendMessage,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      message: sendMessage,
    });

    try {
      const response = await axios.post(
        "/api/chat/messages",
        conversationMessage
      );
      const data = response.data;
      setMessages([...messages, data]);
      setSendMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  //send Composed Message to a friend
  const handleSendComposedMessage = async (e) => {
    e.preventDefault();
    const emailBody = {
      email: receiverEmail.current.value,
    };
    try {
      const findUser = await axios.post("/api/chat/users/email", emailBody);
      const friendId = {
        friendId: findUser.data._id,
      };
      if (user.email !== findUser.data.email) {

        await axios
          .put(`/api/chat/users/friends/add/${user._id}`, friendId)
          .then(async (response) => {
            const friendId = {
              friendId: response.data._id,
            };
            await axios.put(
              `/api/chat/users/friends/add/${findUser.data._id}`,
              friendId
            );
          });

        const createConversation = {
          senderId: user._id,
          receiverId: findUser.data._id
        }
        await axios.post('/api/chat/conversation',createConversation).then( async (response) =>{
          setCurrentChat(response.data)
          console.log(currentChat)
          const messageConvo = {
            conId: response.data._id,
            sender: user._id,
            text: sendMessage,
          }
          const receiverId = currentChat.members.find(
            (member) => member !== user._id
          );
          socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            message: sendMessage,
          });
          const messageData = await axios.post(
            "/api/chat/messages",
            messageConvo
          );
          toast.success(`Message Successfully send to ${findUser.data.name}`)
          closeModal();
          setMessages([...messages, messageData.data]);
          setSendMessage("");
        })
        
        
        

      } else {
        toast.error(`Cannot add your self!`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const conversationMessages = async () => {
      try {
        const response = await axios.get(
          "/api/chat/messages/" + currentChat?._id
        );
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    conversationMessages();
  }, [currentChat]);

  //scroll the view inside the chatbox to the current new message
  useEffect(() => {
    if (newMessageView.current) {
      executScrollView();
    }
  }, [messages]);

  return (
    <>
      <div className="chatContainer">
        <div className="InnerContainer mx-5 py-5">
          <div className="row">
            <div className="col col-md-5">
              <div className="contactOuterContainer">
                <div className="contactInnerContainer">
                  <div className="topContainer">
                    <h4>Contacts</h4>
                    <UserInfo currentUser={user} />
                  </div>
                  <div className="contactContainer">
                    {friendData.map((friend) => (
                      <div className="clickedContact">
                        <ContactList
                          friendData={friend}
                          currentUser={user}
                          onlineUsers={onlineUsers}
                          setReceiver={setReceiver}
                          setFriendId={setFriendId}
                          setCurrentChat={setCurrentChat}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-md-7">
              <div className="outerContainer">
                <div className="ChatInnerContainer">
                  {currentChat ? (
                    <>
                      <ContactsInfo
                        currentUser={user}
                        currentChat={currentChat}
                        friendId={friendId}
                        setCurrentChat={setCurrentChat}
                      />
                      <div className="chatBoxTop">
                        {messages.map((m) => (
                          <div ref={newMessageView}>
                            <Message
                              currentUser={user}
                              receiver={receiver}
                              key={m.id}
                              messages={m}
                              own={m.sender === user?._id}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="chatBoxBottom">
                        <textarea
                          className="chatMessageInput"
                          placeholder="Type a message...."
                          value={sendMessage}
                          onChange={(e) => setSendMessage(e.target.value)}
                        ></textarea>
                        <button
                          className="chatSubmitButton"
                          onClick={handleSendMessage}
                        >
                          Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="noConvo">Chat to someone</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
