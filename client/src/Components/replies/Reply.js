import replyIcon from "../../resources/reply.png";
import likeIcon from "../../resources/like.png";
import likeBlue from "../../resources/like-blue.png";
import unlikeIcon from "../../resources/unlike.png";
import unlikeRed from "../../resources/unlike-red.png";
import avatar from "../../resources/img_avatar.png";
import { useContext, useEffect, useRef, useState } from "react";
import Replies from "./Replies";
import CommentBox from "../CommentBox";
import { motion } from "framer-motion";
import settings from "../../resources/settings.png";
import ContextMenu from "../ContextMenu";
import { AuthContext } from "../../helpers/AuthContext";
import moment from "moment";

const Reply = ({ reply, onDelete, addReply }) => {
  const { authState } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [likes, setLikes] = useState(reply.likes);
  const [dislikes, setDisLikes] = useState(reply.dislikes);
  const [liked, setLiked] = useState(
    reply.userLiked === "liked" ? true : false
  );
  const [disliked, setDisLiked] = useState(
    reply.userLiked === "disliked" ? true : false
  );
  const [userLiked, setUserLiked] = useState(reply.userLiked);

  let likesColor = "var(--secondary)";
  let dislikesColor = "var(--secondary)";
  if (userLiked === "liked") {
    if (reply.likes >= 0) {
      likesColor = "var(--primary)";
    } else {
      likesColor = "var(--secondary)";
    }
  } else if (userLiked === "disliked") {
    if (reply.dislikes >= 0) {
      dislikesColor = "var(--red)";
    } else {
      dislikesColor = "var(--secondary)";
    }
  } else {
    likesColor = "var(--secondary)";
    dislikesColor = "var(--secondary)";
  }

  const likedFunc = (e) => {
    e.preventDefault();
    if (disliked) {
      setLikes(likes + 1);
      setDisLikes(dislikes - 1);
      setLiked(true);
      setDisLiked(false);
      setUserLiked("liked");
    } else {
      if (!liked) {
        setLikes(likes + 1);
        setLiked(true);
        setUserLiked("liked");
      } else {
        setLikes(likes - 1);
        setLiked(false);
        setUserLiked("");
      }
    }
  };

  const disLikedFunc = (e) => {
    e.preventDefault();
    if (liked) {
      setLikes(likes - 1);
      setDisLikes(dislikes + 1);
      setLiked(false);
      setDisLiked(true);
      setUserLiked("disliked");
    } else {
      if (!disliked) {
        setDisLikes(dislikes + 1);
        setDisLiked(true);
        setUserLiked("disliked");
      } else {
        setDisLikes(dislikes - 1);
        setDisLiked(false);
        setUserLiked("");
      }
    }
  };

  const [showCommentBox, setShowCommentBox] = useState("none");
  const showCommentBoxFunc = (e) => {
    e.preventDefault();
    showCommentBox === "none"
      ? setShowCommentBox("block")
      : setShowCommentBox("none");
  };

  const rotateVariant = {
    rotate: { rotate: -20, transition: { duration: 0.2 } },
    stop: {
      rotate: 20,
    },
  };

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      <div
        className="postsContainer"
        style={{
          float: reply.replied_to != null && "right",
          width: reply.replied_to != null && "95%",
          marginBottom: 20,
        }}
      >
        <ContextMenu reply={reply} show={show} onDelete={onDelete} />

        <div
          className="postsContainer-div"
          style={{
            width: "10%",
            margin: "0 10px 0 0px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <img href="#profile" className="avatar" src={avatar} alt="Profile" />
        </div>
        <div className="postsContainer-div">
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <h4 style={{ color: "var(--secondary)", marginRight: 10 }}>
              Replied by{" "}
              <a href={`/user/${reply.user_name}`}>
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                  {reply.user_name}{" "}
                  <span
                    style={{
                      color: "var(--secondary)",
                    }}
                  >
                    {moment(reply.replied_time).local().fromNow()}
                  </span>
                </span>
              </a>
            </h4>
          </div>
          {authState.name == reply.user_name && (
            <button
              ref={ref}
              style={{ float: "right", marginTop: "-32px" }}
              className="nullBtn"
              onClick={() => setShow((oldState) => !oldState)}
            >
              <motion.img
                style={{
                  height: "25px",
                  marginTop: 5,
                }}
                className="icon"
                src={settings}
                variants={rotateVariant}
                animate={show ? "rotate" : "stop"}
              />
            </button>
          )}

          <div style={{ display: "flex" }}>
            <p style={{ color: "var(--gray)" }}>
              {reply.replied_to !== null && (
                <a href={`/user/${reply.replied_to}`}>
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                    @{reply.replied_to}
                  </span>
                </a>
              )}{" "}
              <span
                dangerouslySetInnerHTML={{ __html: reply.description }}
              ></span>
            </p>
          </div>

          <hr style={{ margin: "15px 0" }} />

          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <button className="nullBtn" onClick={likedFunc}>
                <img
                  className="navIcon"
                  src={userLiked === "liked" ? likeBlue : likeIcon}
                />
              </button>
              <h3
                style={{
                  color: likesColor,
                  marginRight: 10,
                }}
              >
                {likes}
              </h3>
              <button
                style={{ marginTop: 5 }}
                className="nullBtn"
                onClick={disLikedFunc}
              >
                <img
                  className="navIcon"
                  src={userLiked === "disliked" ? unlikeRed : unlikeIcon}
                />
              </button>
              <h3
                style={{
                  color: dislikesColor,
                  marginRight: 20,
                }}
              >
                {dislikes}
              </h3>
            </div>
            <button
              className="nullBtn"
              style={{ display: "flex" }}
              onClick={showCommentBoxFunc}
            >
              <img
                className="navIcon"
                src={replyIcon}
                style={{ marginTop: 3 }}
              />
              <h3 style={{ color: "var(--secondary)" }}>Reply</h3>
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          display: showCommentBox,
          float: reply.replied_to != "" && "right",
          width: reply.replied_to != "" && "95%",
        }}
      >
        <CommentBox
          addReply={addReply}
          parent_id={reply.parent_id ? reply.parent_id : reply.id}
          replyTo={reply.user_name}
          user_name={authState.name}
          user_id={authState.id}
          post_id={reply.post_id}
        />
      </div>

      {reply.replies !== null && (
        <Replies replies={reply.replies} onDelete={onDelete} />
      )}
    </>
  );
};

export default Reply;
