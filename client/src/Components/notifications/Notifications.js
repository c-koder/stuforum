import { useContext, useEffect, useState } from "react";
import "../../styles/notification.css";
import { AuthContext } from "../../helpers/AuthContext";
import useNotifications from "../../hooks/useNotifications";
import Notification from "./Notification";
import InfiniteScoll from "react-infinite-scroll-component";
import axios from "axios";

const Notifications = ({
  show,
  notificationCount,
  setNotificationCount,
  newNotification,
}) => {
  const { authState } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const { response } = useNotifications(authState.id);

  useEffect(() => {
    if (response != null) {
      setNotifications(response);
    }
  }, [response]);

  useEffect(() => {
    if (newNotification != null) {
      const notif = newNotification;
      addNotification(notif);
    }
  }, [newNotification]);

  const addNotification = (notif) => {
    setNotifications([notif, ...notifications]);
    setNotificationCount(notificationCount + 1);
  };

  useEffect(() => {
    let count = 0;
    notifications.forEach((notification) => {
      notification.viewed == 0 && count++;
    });
    setNotificationCount(count);
  }, [notifications]);

  const changeViewed = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, viewed: notification.viewed == 0 ? 1 : 1 }
          : notification
      )
    );

    const exists = notifications.filter((item) => item.viewed == 0);
    setNotificationCount(exists.length);

    axios.post("http://localhost:3001/user/notificationviewed", {
      id: id,
    });
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));

    axios.post("http://localhost:3001/user/deletenotification", {
      id: id,
    });
  };

  const markAsSeen = () => {
    setNotifications(
      notifications.map(
        (notification) => notification && { ...notification, viewed: 1 }
      )
    );
    axios.post("http://localhost:3001/user/allnotificationsviewed", {
      user_id: authState.id,
    });
  };

  const [scrollNumber, setScollNumber] = useState(0);
  const notificationsPerPage = 10;
  const scrollsVisited = scrollNumber * notificationsPerPage;
  const [hasMore, setHasMore] = useState(true);

  const displayNotifications = notifications
    .slice(0, scrollsVisited + notificationsPerPage)
    .map((notification) => {
      return (
        <Notification
          key={notification.id}
          notification={notification}
          changeViewed={changeViewed}
          onDelete={deleteNotif}
        />
      );
    });

  return (
    <>
      <div
        className={"dropdown" + (show ? " shown" : "")}
        style={{
          marginLeft: -370,
          width: "420px",
        }}
        id="scrollableDiv"
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
          <InfiniteScoll
            dataLength={scrollsVisited}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
            next={() => {
              setHasMore(notifications[scrollsVisited] != null);
              setTimeout(() => {
                setScollNumber(scrollNumber + 1);
              }, 500);
            }}
          >
            {displayNotifications}
          </InfiniteScoll>

          {notifications.length === 0 && (
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
