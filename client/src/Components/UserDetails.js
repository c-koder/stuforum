import React, { useContext } from "react";
import { Parser } from "html-to-react";

import like from "../resources/like-blue.png";
import avatar from "../resources/img_avatar.png";
import { AuthContext } from "../helpers/AuthContext";
import { abbreviateNumber } from "../helpers/AbbreviateNumber";

const UserDetails = ({ user }) => {
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
    if (user.join_date != null) {
      let date = user.join_date.substring(0, 10);
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
    }
  };

  return (
    <>
      <div
        className="content-container"
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
                alt="Profile Pic"
              />
              <div className="profilepic__content">
                <span className="profilepic__text">Edit Profile</span>
              </div>
            </div>

            <h2 style={{ marginTop: 20 }}>
              {user.full_name}
              <br />
              <span style={{ fontSize: 16 }}>- {user.nick_name} -</span>
            </h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3 style={{ color: "var(--secondary)" }}>
                {abbreviateNumber(user.likes)}
              </h3>
              <img
                style={{ marginLeft: 10, height: 20, marginTop: 4 }}
                className="icon"
                src={like}
              />
            </div>
            <div
              className="content-container"
              style={{
                marginTop: -10,
                boxShadow: "none",
                border: "none",
              }}
            >
              <span style={{ textAlign: "center", fontSize: 18 }}>
                {Parser().parse(user.description)}
              </span>
              <hr style={{ marginTop: 20, marginBottom: 20 }} />
              <h4
                style={{
                  color: "var(--secondary)",
                  textAlign: "center",
                  marginBottom: authState.nick_name == user.nick_name && 20,
                }}
              >
                Joined {formatDate()}
              </h4>
              {authState.nick_name === user.nick_name && (
                <button
                  className="btn shadow-none"
                  style={{ margin: 0, width: "100%" }}
                >
                  Edit Details
                </button>
              )}
            </div>
          </div>
        </center>
      </div>
    </>
  );
};

export default UserDetails;
