import { useState } from "react";
import Notification from "./Notification";

const Notifications = ({ show, setNotificationCount }) => {
  const [notificationsList, setNotifications] = useState([
    {
      id: 1,
      byUser: "Lorem Piret",
      type: "up voted",
      postId: 3,
      description: "your question",
      time: "8hr ago",
      viewed: false,
    },
    {
      id: 2,
      byUser: "Dimsum Lorem",
      type: "liked",
      postId: 1,
      description: "your answer",
      time: "6hr ago",
      viewed: false,
    },
    {
      id: 3,
      byUser: "Peirtem Doemus",
      type: "liked",
      postId: 2,
      description: "your question",
      time: "3hr ago",
      viewed: true,
    },
    {
      id: 4,
      byUser: "Peirtem Doemus",
      type: "commented",
      postId: 2,
      description: "on your question",
      time: "3hr ago",
      viewed: true,
    },
    {
      id: 5,
      byUser: "Peirtem Doemus",
      type: "commented",
      postId: 1,
      description: "on your question",
      time: "3hr ago",
      viewed: true,
    },
  ]);

  const changeViewed = (id) => {
    setNotifications(
      notificationsList.map((notification) =>
        notification.id === id && !notification.viewed
          ? { ...notification, viewed: true }
          : notification
      )
    );

    const exists = notificationsList.filter((item) => item.viewed === false);
    setNotificationCount(exists.length);
  };

  const deleteNotif = (id) => {
    setNotifications(notificationsList.filter((notif) => notif.id !== id));
  };

  const removeNotifs = () => {
    setNotifications(notificationsList.filter((notif) => !notif));
  };

  return (
    <>
      <div className={"dropdown" + (show ? " shown" : "")}>
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
              onClick={removeNotifs}
            >
              Clear All
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
