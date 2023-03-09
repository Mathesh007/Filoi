import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [contactsReceived, setContactsReceived] = useState([]);
  const [popular, setpopular] = useState(true);

  const handlePopular = () => {
    setpopular(true);
  };

  const handleActive = () => {
    setpopular(false);
  };

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUser(data);
    }
  }, []);

  useEffect(async () => {
    if (currentUser) {
      const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      const sortDataBySent = data.data.slice().sort((a, b) => b.sent - a.sent);
      const sortDataByReceived = data.data.slice().sort((a, b) => b.received - a.received);
      setContacts(sortDataBySent);
      setContactsReceived(sortDataByReceived);
    }
  }, [currentUser]);

  return (
    <>
      <DashboardContainer>
        <div className="dashboard-container">
          <div className="dashboard">
            <div className="heading">
              <h1>College Leaderboard</h1>
            </div>
            <div className="button-section">
              <button onClick={handlePopular}>Popularity</button>
              <button onClick={handleActive}>Activity</button>
            </div>
            {!popular ? (
              <div className="ranking-section">
                {contacts.map((contact, index) => {
                  if (currentUser.college === contact.college) {
                    return (
                      <div className="rank">
                        <div className="left">
                          <div className="avatar">
                            <img
                              src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                              alt=""
                            />
                          </div>
                          <div className="rank-name">{contact.username}</div>
                        </div>
                        <div className="rank-value">{contact.sent}</div>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <div className="ranking-section">
                {contactsReceived.map((contact, index) => {
                  if (currentUser.college === contact.college) {
                    return (
                      <div className="rank">
                        <div className="left">
                          <div className="avatar">
                            <img
                              src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                              alt=""
                            />
                          </div>
                          <div className="rank-name">{contact.username}</div>
                        </div>

                        <div className="rank-value">{contact.received}</div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </DashboardContainer>
    </>
  );
}

export default Dashboard;

const DashboardContainer = styled.div`
  .dashboard-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .dashboard {
      height: 80vh;
      width: 60vw;
      padding: 20px;
      background: #00000076;
      border-radius: 2rem;
      display: flex;
      flex-direction: column;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
      .button-section {
        display: flex;
        justify-content: space-around;
        margin-bottom: 40px;
        button {
          font-size: 1rem;
          width: 150px;
          padding: 0.7rem;
          border-radius: 0.3rem;
          background-color: #9a86f3;
          color: white;
          cursor: pointer;
        }
      }
      .heading {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 2rem;
        justify-content: center;
        h1 {
          color: white;
          text-transform: uppercase;
        }
      }
      .ranking-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 2rem;
        &::-webkit-scrollbar {
          width: 0.2rem;
          &-thumb {
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
          }
        }
        .rank {
          background-color: #ffffff34;
          min-height: 5rem;
          cursor: pointer;
          width: 60%;
          border-radius: 0.6rem;
          padding: 0.4rem;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          transition: 0.5s ease-in-out;
          .left {
            display: flex;
            align-items: center;
            .avatar {
              margin-left: 10px;
              img {
                height: 3rem;
              }
            }
            .rank-name {
              margin-left: 15px;
              color: white;
            }
          }
          .rank-value {
            padding: 4px;
            margin-right: 20px;
            color: white;
            background: black;
          }
        }
      }
    }
    @media screen and (max-width:600px){
      .dashboard{
        width: 90vw;
        .ranking-section{
          .rank{
            width: 80%;
          }
        }
      }
      }
  }
`;
