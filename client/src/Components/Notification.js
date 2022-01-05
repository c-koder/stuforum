import { Link } from "react-router-dom";
import close from "../resources/close.png";
import avatar from "../resources/img_avatar.png";
import liked from "../resources/round/liked.png";
import upVoted from "../resources/round/upvoted.png";
import commented from "../resources/round/commented.png";
import moment from "moment";
import { useEffect, useState } from "react";

const Notification = ({ notification, changeViewed, onDelete }) => {
  const [time, setTime] = useState(moment(notification.time).local().fromNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment(notification.time).local().fromNow());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
            notification.type === "LK"
              ? liked
              : notification.type === "CM"
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
              <span style={{ color: "var(--primary)" }}>
                <Link
                  style={{ all: "unset" }}
                  to={{
                    pathname: `/user/${notification.user_from}`,
                  }}
                >
                  {notification.user_from}
                </Link>
              </span>{" "}
              <Link
                style={{ all: "unset" }}
                to={{
                  pathname: `/post/${notification.post_id}`,
                }}
              >
                {notification.description}{" "}
              </Link>
            </h4>
          </div>
          <h5 style={{ float: "left", color: "var(--secondary)" }}>{time}</h5>
          {notification.viewed == 0 && (
            <h6>
              <pre style={{ color: "var(--primary)" }}> 🔵</pre>
            </h6>
          )}
        </div>
      </div>

      <hr style={{ marginBottom: 20, opacity: 0.3 }} />
    </>
  );
};

export default Notification;
