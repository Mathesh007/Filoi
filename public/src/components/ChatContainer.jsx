import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import Webcam from "react-webcam";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";
import { HiChatBubbleLeftRight } from "react-icons/hi2";

const videoConstraints = {
  width: 600,
  height: 400,
  facingMode: "user",
};

export default function ChatContainer({ currentChat, socket, handleClick, handleCurrentChat }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isVideo, setVideo] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clickHandler = () => {
    handleClick();
    handleCurrentChat();
  }

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <div className="leader-logout">
          <Link to="/dashboard">
            <button className="leaderboardButton">Leaderboards</button>
          </Link>
          <div className="sep"></div>
          <Logout />
        </div>
      </div>
      <div className="chat-messages">
        {isSmallScreen && (
          <HiChatBubbleLeftRight
            class="chat-icon"
            style={{
              color: "#9a86f3",
              right:"15vw",
              fontSize: "2em",
              position:"absolute"
            }}
            onClick={clickHandler}
          />
        )}
        {isVideo ? (
          <Webcam
            audio={false}
            height={400}
            ref={null}
            width={!isSmallScreen ? 600 : 310}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <></>
        )}

        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="input-section"
        style={{ display: "flex", background: "#080420" }}
      >
        <AiOutlineVideoCamera
          onClick={(e) => {
            e.preventDefault();
            setVideo(!isVideo);
          }}
          style={{
            fontSize: "40px",
            margin: "10px 5px 10px 25px",
            color: "white",
            textAlign: "center",
          }}
        />
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .leader-logout {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      padding: 1rem;
      .sep {
        width: 1em;
      }
      .leaderboardButton {
        padding: 0.7rem;
        border-radius: 0.3rem;
        background-color: #9a86f3;
        color: white;
        cursor: pointer;
      }
    }
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
        margin-top: 8px;
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
  .input-section {
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 600px) {
      width: 100%;
      margin-left: 5vw;
    }
  }
  @media screen and (max-width: 600px) {
    width: 85vw;
    margin-left: -25vw;
  }
`;
