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
import time from "../../resources/time.png";
import ContextMenu from "../ContextMenu";
import { AuthContext } from "../../helpers/AuthContext";
import moment from "moment";
import axios from "axios";
import useReplyData from "../../hooks/useReplyData";
import ReactTooltip from "react-tooltip";
import { Parser } from "html-to-react";
import { abbreviateNumber } from "../../helpers/AbbreviateNumber";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { PORT } from "../../constants/Port";

const Reply = ({ socket, reply, onDelete, addReply, answerOnly, answered }) => {
  const { width } = useWindowDimensions();
  const { authState } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [likes, setLikes] = useState(reply.likes);
  const [dislikes, setDisLikes] = useState(reply.dislikes);

  const [prefId, setPrefId] = useState(null);
  const [userLiked, setUserLiked] = useState();
  const [liked, setLiked] = useState();
  const [disliked, setDisLiked] = useState();

  const { response } = useReplyData(reply.id, authState.id);

  useEffect(() => {
    if (response != null) {
      setPrefId(response.id);
      if (response.preference == "1") {
        setUserLiked("liked");
        setLiked(true);
        setDisLiked(false);
      } else if (response.preference == "0") {
        setUserLiked("disliked");
        setLiked(false);
        setDisLiked(true);
      } else {
        setUserLiked("");
        setLiked(false);
        setDisLiked(false);
      }
    }
  }, [response]);

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
      dislikesColor = "var(--warning)";
    } else {
      dislikesColor = "var(--secondary)";
    }
  } else {
    likesColor = "var(--secondary)";
    dislikesColor = "var(--secondary)";
  }

  const updateReplyPref = (pref, previousPref) => {
    const time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    axios
      .post(`${PORT}reply/updatereplypref`, {
        id: prefId,
        reply_id: reply.id,
        parent_id: reply.parent_id,
        user_id: authState.id,
        post_id: reply.post_id,
        pref: pref,
        previous_pref: previousPref,
        reply_posted_user_id: reply.user_id,
        time: time,
      })
      .then(async (response) => {
        const notification = response.data.notif;
        await socket.emit("send_notification", notification);
      });
  };

  const [disabled, setDisabled] = useState(false);

  const likedFunc = (e) => {
    e.preventDefault();
    if (disliked) {
      setLikes(likes + 1);
      setDisLikes(dislikes - 1);
      setLiked(true);
      setDisLiked(false);
      setUserLiked("liked");
      updateReplyPref("1", "disliked");
    } else {
      if (!liked) {
        setLikes(likes + 1);
        setLiked(true);
        setUserLiked("liked");
        updateReplyPref("1", "");
      } else {
        setLikes(likes - 1);
        setLiked(false);
        setUserLiked("");
        updateReplyPref("", "liked");
      }
    }
    setDisabled(true);
  };

  const disLikedFunc = (e) => {
    e.preventDefault();
    if (liked) {
      setLikes(likes - 1);
      setDisLikes(dislikes + 1);
      setLiked(false);
      setDisLiked(true);
      setUserLiked("disliked");
      updateReplyPref("0", "liked");
    } else {
      if (!disliked) {
        setDisLikes(dislikes + 1);
        setDisLiked(true);
        setUserLiked("disliked");
        updateReplyPref("0", "");
      } else {
        setDisLikes(dislikes - 1);
        setDisLiked(false);
        setUserLiked("");
        updateReplyPref("", "disliked");
      }
    }
    setDisabled(true);
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

  const [repliedTime, setRepliedTime] = useState(
    moment(reply.replied_time).local().fromNow()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRepliedTime(moment(reply.replied_time).local().fromNow());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const [showChildReplies, setShowChildReplies] = useState(false);

  return (
    <div className="content-container">
      <ReactTooltip
        effect="solid"
        place="bottom"
        type="info"
        className="tooltip"
        arrowColor={"var(--secondary)"}
        delayShow={500}
      />
      <div className="row">
        <div className="col-1">
          <img href="#profile" className="avatar" src={avatar} alt="Profile" />
        </div>
        <div className="col" style={{ marginLeft: -10 }}>
          <div className="hstack" style={{ color: "var(--secondary)" }}>
            <a
              href={
                authState.nick_name == reply.nick_name
                  ? "/profile"
                  : `/user/${reply.nick_name}`
              }
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              {reply.nick_name}
            </a>
            <i
              class="bi bi-clock-fill"
              style={{
                fontSize: 18,
                color: "var(--secondary)",
                marginLeft: 5,
              }}
            ></i>
            <span
              style={{
                color: "var(--secondary)",
                marginLeft: 5,
              }}
              data-tip={moment(reply.replied_time).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            >
              {repliedTime}
            </span>
            {authState.nick_name == reply.nick_name && (
              <div className="ms-auto">
                <a
                  role="button"
                  id="post-context"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  variants={rotateVariant}
                >
                  <i
                    class="bi bi-gear-fill"
                    style={{ color: "var(--secondary)", fontSize: 22 }}
                  ></i>
                </a>
                <ContextMenu
                  reply={reply}
                  show={show}
                  onDelete={onDelete}
                  answerOnly={answerOnly}
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex" }}>
            <p style={{ color: "var(--dark)" }}>
              {reply.replied_to != null && (
                <a
                  href={`/user/${reply.replied_to}`}
                  style={{ marginRight: 5 }}
                >
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                    @{reply.replied_to}
                  </span>
                </a>
              )}
            </p>
          </div>

          <div
            style={{
              marginTop: 5,
              marginLeft: reply.description.includes("<ul>") && 20,
            }}
          >
            {Parser().parse(reply.description)}
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
              <button
                className="nullBtn"
                onClick={likedFunc}
                disabled={disabled}
                data-tip="Like this answer"
              >
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
                {abbreviateNumber(likes)}
              </h3>
              <button
                style={{ marginTop: 5 }}
                className="nullBtn"
                onClick={disLikedFunc}
                disabled={disabled}
                data-tip="Dislike this answer"
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
                {abbreviateNumber(dislikes)}
              </h3>
            </div>
            {!answered && (
              <button
                className="nullBtn"
                style={{ display: "flex" }}
                onClick={showCommentBoxFunc}
                disabled={answered}
                data-tip="Leave an answer"
              >
                <img
                  className="navIcon"
                  src={replyIcon}
                  style={{ marginTop: 3 }}
                />
                <h3 style={{ color: "var(--secondary)" }}>Reply</h3>
              </button>
            )}
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
          parent_id={reply.parent_id == null ? reply.id : reply.parent_id}
          replyTo={reply.user_id}
          user_id={authState.id}
          nick_name={authState.nick_name}
          post_id={reply.post_id}
          socket={socket}
        />
      </div>

      {reply.replies != null && (
        <div>
          {reply.replies.length > 0 && (
            <button
              text="Show More"
              className="btn showMoreLink"
              style={{ marginTop: 0, marginBottom: 20 }}
              onClick={(e) => {
                e.preventDefault();
                setShowChildReplies((oldState) => !oldState);
              }}
            >
              {!showChildReplies
                ? `Show ${reply.replies.length} ${
                    reply.replies.length > 1 ? "replies" : "reply"
                  } ▼`
                : `Hide ${reply.replies.length > 1 ? "replies" : "reply"} ▲`}
            </button>
          )}
          {showChildReplies && (
            <Replies
              replies={reply.replies}
              onDelete={onDelete}
              addReply={addReply}
              answered={answered}
              socket={socket}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Reply;
