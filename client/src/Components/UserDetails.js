import React, { useContext } from "react";
import { Parser } from "html-to-react";
import moment from "moment";

import avatar from "../resources/img_avatar.png";
import { AuthContext } from "../helpers/AuthContext";
import { abbreviateNumber } from "../helpers/AbbreviateNumber";

const UserDetails = ({ user }) => {
  const { authState } = useContext(AuthContext);

  console.log(user);

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

  return (
    <div className="content-container">
      <div className="col text-center">
        <center>
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
          <h4 style={{ fontWeight: 600, marginTop: 10 }}>
            {user.full_name}
            <br />
            <span style={{ fontSize: 14 }}>{user.nick_name}</span>
          </h4>
          <div className="d-flex justify-content-center">
            <h5 style={{ color: "var(--secondary)", fontWeight: 600 }}>
              {abbreviateNumber(user.likes)}
            </h5>
            <i
              className="bi bi-hand-thumbs-up-fill"
              style={{
                marginLeft: 5,
                color: "var(--primary)",
                fontSize: 22,
              }}
            ></i>
          </div>
          <span style={{ textAlign: "center", fontSize: 18 }}>
            {Parser().parse(user.description)}
          </span>
          <hr />
          <h6
            style={{
              color: "var(--secondary)",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Joined{" "}
            {moment(user.join_date, "YYYY-MM-DD HH:mm:ss").format(
              "dddd, MMMM Do YYYY"
            )}
          </h6>
          {authState.id === user.id && (
            <button
              className="btn shadow-none"
              data-bs-toggle="modal"
              data-bs-target="#editProfileModal"
            >
              Edit Details
            </button>
          )}
        </center>
      </div>
    </div>
  );
};

export default UserDetails;
