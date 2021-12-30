import { Link } from "react-router-dom";
import close from "../resources/close.png";
import avatar from "../resources/img_avatar.png";
import liked from "../resources/round/liked.png";
import upVoted from "../resources/round/upvoted.png";
import commented from "../resources/round/commented.png";
import { useState } from "react";

const Notification = ({ notification, changeViewed, onDelete }) => {
  return (
    <>
      <span
        style={{ cursor: "pointer", float: "right" }}
        onClick={() => {
          onDelete(notification.id);
        }}
      >
        <img className="icon" src={close} style={{ height: "20px" }} />
      </span>
      <Link
        style={{ all: "unset" }}
        to={{
          pathname: `/view-post/${notification.postId}`,
        }}
      >
        <div
          className="notification-item"
          onClick={() => {
            changeViewed(notification.id);
          }}
        >
          <img
            src={avatar}
            alt="Profile Poc"
            style={{ borderRadius: "50%", height: "50px" }}
          />
          <img
            className="icon"
            src={
              notification.type === "liked"
                ? liked
                : notification.type === "commented"
                ? commented
                : upVoted
            }
            style={{
              height: "25px",
              marginLeft: -10,
              marginTop: 26,
              marginRight: 10,
            }}
          />
          <div>
            <div style={{ display: "flex" }}>
              <h4>
                <span style={{ color: "#3d5af1" }}>{notification.byUser}</span>{" "}
                {notification.type} {notification.description}{" "}
              </h4>
            </div>
            <h5 style={{ float: "left", color: "#b4b4b4" }}>
              {notification.time}
            </h5>
            {!notification.viewed && (
              <h6>
                <pre style={{ color: "#3d5af1" }}> 🔵</pre>
              </h6>
            )}
          </div>
        </div>
      </Link>

      <hr style={{ marginBottom: 20, opacity: 0.3 }} />
    </>
  );
};

export default Notification;
