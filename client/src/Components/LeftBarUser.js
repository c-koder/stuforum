import React, { useContext, useState } from "react";
import like from "../resources/like-blue.png";
import avatar from "../resources/img_avatar.png";
import Button from "./Button";
import { AuthContext } from "../helpers/AuthContext";

const LeftBarUser = ({ user }) => {
  const { authState } = useContext(AuthContext);
  const onIconClick = () => {
    const input = document.getElementById("file-input");
    if (input) {
      input.click();
    }
  };

  const getFile = (e) => {
    const file = e.target.value;
    console.log(file);
  };

  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDate = () => {
    let date = authState.join_date.substring(0, 10);
    let year = date.substring(0, 4);
    let month = monthArray[parseInt(date.substring(5, 7)) - 1];
    let day = date.substring(8, 10);
    let dayStringAddition = "th";
    if (day == 1 || day == 21 || day == 31) {
      dayStringAddition = "st";
    }
    if (day == 2 || day == 22) {
      dayStringAddition = "nd";
    }
    return `${day}${dayStringAddition} of ${month} ${year}`;
  };

  return (
    <>
      <div
        className="whiteContainer"
        style={{
          marginTop: 0,
        }}
      >
        <center>
          <div
            style={{
              display: "block",
            }}
          >
            <div className="profilepic" onClick={onIconClick}>
              <input
                type="file"
                id="file-input"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg"
                onChange={getFile}
              />
              <img
                className="profilepic__image"
                src={avatar}
                width="150"
                alt="Profile Poc"
              />
              <div className="profilepic__content">
                <span className="profilepic__text">Edit Profile</span>
              </div>
            </div>

            <h2 style={{ marginTop: 20 }}>{authState.name}</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3 style={{ color: "#B4B4B4" }}>{authState.likes}</h3>
              <img
                style={{ marginLeft: 10, height: 20, marginTop: 3 }}
                className="icon"
                src={like}
              />
            </div>
            <div
              className="whiteContainer"
              style={{
                marginTop: -10,
                boxShadow: "none",
              }}
            >
              <p style={{ textAlign: "justify" }}>{authState.description}</p>
              <hr style={{ marginTop: 20, marginBottom: 20 }} />
              <h4
                style={{
                  color: "#B4B4B4",
                  textAlign: "center",
                  marginBottom: user === authState.name && 20,
                }}
              >
                Joined {formatDate()}
              </h4>
              {user === authState.name && <Button text={"Edit Details"} />}
            </div>
          </div>
        </center>
      </div>
    </>
  );
};

export default LeftBarUser;
