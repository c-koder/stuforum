import { useContext, useEffect, useState } from "react";
import "../styles/notification.css";
import { AuthContext } from "../helpers/AuthContext";
import useNotifications from "../hooks/useNotifications";
import Notification from "./Notification";

const Notifications = ({ show, notificationCount, setNotificationCount }) => {
  const { authState } = useContext(AuthContext);

  const [notificationsList, setNotifications] = useState([]);
  const { response } = useNotifications(authState.id);

  useEffect(() => {
    if (response != null) {
      setNotifications(response);
    }
  }, [response]);

  useEffect(() => {
    let count = 0;
    notificationsList.forEach((notification) => {
      notification.viewed == 0 && count++;
    });
    setNotificationCount(count);
  }, [notificationsList]);

  const changeViewed = (id) => {
    setNotifications(
      notificationsList.map((notification) =>
        notification.id === id
          ? { ...notification, viewed: notification.viewed == 0 ? 1 : 1 }
          : notification
      )
    );

    const exists = notificationsList.filter((item) => item.viewed == 0);
    setNotificationCount(exists.length);
  };

  const deleteNotif = (id) => {
    setNotifications(notificationsList.filter((notif) => notif.id !== id));
  };

  const markAsSeen = () => {
    setNotifications(
      notificationsList.map(
        (notification) => notification && { ...notification, viewed: 1 }
      )
    );
  };

  return (
    <>
      <div
        className={"dropdown" + (show ? " shown" : "")}
        style={{
          marginLeft: -370,
          width: "420px",
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <h2 style={{ float: "left" }}>Notifications</h2>
          <div style={{ display: "flex", float: "right" }}>
            <button
              className="btn btn-block"
              style={{
                width: "100%",
                padding: "5px 20px",
                fontSize: 16,
              }}
              onClick={markAsSeen}
              disabled={notificationCount == 0 ? true : false}
            >
              Mark all seen
            </button>
          </div>
        </div>
        <br />
        <hr style={{ marginTop: 20, opacity: 0.3 }} />
        <div>
          {notificationsList.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              changeViewed={changeViewed}
              onDelete={deleteNotif}
            />
          ))}

          {notificationsList.length === 0 && (
            <center>
              <h4 style={{ marginTop: 20 }}>No new notifications.</h4>
            </center>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
