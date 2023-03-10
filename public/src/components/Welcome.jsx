import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import Hello from "../assets/hello.gif"
import Logout from "./Logout";
import { useMediaQuery } from "@material-ui/core";
export default function Welcome({chatOpen}) {
  const [userName, setUserName] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  useEffect(() => { },[chatOpen])
  return (
    <Container style={{ width: isSmallScreen && !chatOpen ? "0" : "100%" , display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      {(!isSmallScreen || chatOpen) && <div><img src={Hello} alt="" />
      <h1>
        Welcome, <span>{userName} !</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3></div>}
      
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  height: 80%;

  @media screen and (max-width: 600px) {
      width: 85vw;
      margin-left: -10vw;
  }
`;
