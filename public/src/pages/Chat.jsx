import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Logout from "../components/Logout";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useMediaQuery } from "@material-ui/core";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [chatOpen, setChatOpen] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);

  useEffect(() => {
    console.log(chatOpen);
  },[chatOpen,currentChat])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleClick = () => {
    setChatOpen(!chatOpen);
  }

  const handleCurrentChat = () => {
    setCurrentChat(undefined)
  }

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            changeChat={handleChatChange}
            user={currentUser}
            handleClick={handleClick}
            chatOpen={chatOpen}
          />
          {currentChat === undefined ? (
            <div
              className="welcome-wrapper"
              style={{ width: isSmallScreen && !chatOpen ? "0" : "100%" }}
            >
              <div className="welcome-header">
                <Link to="/dashboard">
                  <button className="leaderboardButton">Leaderboards</button>
                </Link>
                <HiChatBubbleLeftRight
                  class="chat-icon"
                  style={{
                    color: "#9a86f3",
                    marginTop: "10px",
                    fontSize: "1.8em",
                  }}
                  onClick={handleClick}
                />
                <Logout />
              </div>
              <Welcome chatOpen={chatOpen} />
            </div>
          ) : (
              <ChatContainer currentChat={currentChat} socket={socket} handleClick={handleClick} handleCurrentChat={ handleCurrentChat } />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    .welcome-wrapper {
      .welcome-header {
        display: flex;
        width: 100%;
        padding: 1rem;
        justify-content: space-between;
        .leaderboardButton {
          padding: 0.7rem;
          border-radius: 0.3rem;
          background-color: #9a86f3;
          color: white;
          cursor: pointer;
        }
        .chat-icon{
          display: none;
          cursor: pointer;
        }
        @media screen and (max-width:600px){
          width: 85vw;
          margin-left:-20vw;
          .chat-icon{
            display: block;
          }
        }
      }
    }
  }
`;
