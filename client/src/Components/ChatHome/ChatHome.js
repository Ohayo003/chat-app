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
  const [senderId, setSenderId] = useState();
  const receiverEmail = useRef();
  const [newMessage, setNewMessage] = useState(null);
  const newMessageView = useRef();
  const socket = useRef();
  const numOfMessage = useRef();


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
  }, [friendData, user._id]);

  //Get the messages from the sender and initializes the socket
  useEffect(() => {
    socket.current = io("ws://localhost:5000");

    numOfMessage.current = 0;

    socket.current.on("getMessage", (messageData) => {
      axios.get(`/api/chat/users/${messageData.senderId}`).then((response) => {
        playSound(soundNotification);
        toast.info(`${response.data.name} sent you a mesasge.`);
        setSenderId(response.data._id);
        numOfMessage.current += 1;
      });
      setNewMessage({
        sender: messageData.senderId,
        text: messageData.message,
        createdAt: Date.now(),
      });
    });
  }, [soundNotification,senderId]);

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
      if (receiverEmail.current.value !== "") {
        await axios
          .post("/api/chat/users/email", emailBody)
          .then(async (getEmailResponse) => {
            if (getEmailResponse.data === null) {
              toast.error(`${emailBody.email} account does not exist!`);
            } else if (!getEmailResponse.status) {
              toast.error(`Something went wrong. Please try again.`);
            }
            const friendId = {
              friendId: getEmailResponse.data._id,
            };
            //Check if the email is not the current user's email
            if (user.email !== getEmailResponse.data.email) {
              await axios
                .put(`/api/chat/users/friends/add/${user._id}`, friendId)
                .then(async (addUserResponse) => {
                  const friendId = {
                    friendId: addUserResponse.data._id,
                  };
                  await axios.put(
                    `/api/chat/users/friends/add/${getEmailResponse.data._id}`,
                    friendId
                  );
                });

              const createConversation = {
                senderId: user._id,
                receiverId: getEmailResponse.data._id,
              };
              //Check if the conversation of two users already exist if not add new one
              await axios
                .get(
                  `/api/chat/conversation/getConversation/${user._id}/${getEmailResponse.data._id}`
                )
                .then(async (getConversationResponse) => {
                  if (getConversationResponse.data === null) {
                    await axios
                      .post("/api/chat/conversation", createConversation)
                      .then(async (newConversationResponse) => {
                        const messageConvo = {
                          conId: newConversationResponse.data._id,
                          sender: user._id,
                          text: sendMessage,
                        };
                        await axios.post("/api/chat/messages", messageConvo);
                        setSendMessage("");
                        toast.success(
                          `Message Successfully send to ${getEmailResponse.data.name}`
                        );
                        closeModal();
                      });
                  } else {
                    const messageConvo = {
                      conId: getConversationResponse.data._id,
                      sender: user._id,
                      text: sendMessage,
                    };
                    await axios.post("/api/chat/messages", messageConvo);
                    setSendMessage("");
                    toast.success(
                      `Message Successfully send to ${getEmailResponse.data.name}`
                    );
                    closeModal();
                  }
                });
            } else {
              toast.error(`sending messag to self is invalid!`);
            }
          });
      } else {
        toast.error("Please Enter Receiver's Email");
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
                          numOfMessage={numOfMessage}
                          senderId={senderId}
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
                      <div className="row justify-content-end px-5 py-3">
                        <Fab
                          color="primary"
                          onClick={showModal}
                          aria-label="add"
                        >
                          <EditIcon />
                        </Fab>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Create Mesage Modal */}
      <div id="modalComposeMessage" className="modal">
        {/* Modal content */}
        <div className="modal-content">
          <div className="modal-header text-center">
            <p className="modal-title w-100 font-weight-bold">
              Create New Message
            </p>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-body mx-3">
            <div className="md-form">
              <label htmlFor="emailAddress" className="mb-2 text-start">
                Receiver's Email Address
              </label>
              <input
                className="form-control"
                type="email"
                name="emailAddress"
                ref={receiverEmail}
                placeholder="Enter Email Address"
                required
              />
            </div>
            <div className="md-form">
              <label htmlFor="textMessage" className="mt-2 mb-2 text-start">
                Message
              </label>
              <textarea
                className="form-control"
                type="text"
                name="textMessage"
                value={sendMessage}
                onChange={(e) => {
                  setSendMessage(e.target.value);
                }}
                placeholder="Enter a message..."
                required
              />
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="submit"
                onClick={handleSendComposedMessage}
                className="btn btn-info btn-sm btnAdd"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
