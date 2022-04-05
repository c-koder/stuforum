import { useEffect, useState, useContext } from "react";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import axios from "axios";
import { Parser } from "html-to-react";

import { AuthContext } from "../../helpers/AuthContext";
import { abbreviateNumber } from "../../helpers/AbbreviateNumber";
import { PORT } from "../../constants/Port";
import Tags from "../tags/Tags";
import ContextMenu from "../ContextMenu";
import { Link } from "react-router-dom";

const Post = ({
  post,
  tags,
  postPref,
  singlePost,
  commentCount,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
  viewingQuestions,
  answerOnly,
  socket,
}) => {
  const { authState } = useContext(AuthContext);

  const [leads, setLeads] = useState(post.leads);

  const [userVoted, setUserVoted] = useState();
  const [upVoted, setUpVoted] = useState();
  const [downVoted, setDownVoted] = useState();
  const [prefId, setPrefId] = useState(null);

  useEffect(() => {
    if (postPref != null) {
      setPrefId(postPref.id);
      if (postPref.preference == "1") {
        setUserVoted("useful");
        setUpVoted(true);
        setDownVoted(false);
      } else if (postPref.preference == "0") {
        setUserVoted("useless");
        setUpVoted(false);
        setDownVoted(true);
      } else {
        setUserVoted("");
        setUpVoted(false);
        setDownVoted(false);
      }
    } else {
      setPrefId(null);
    }
  }, [postPref]);

  let labelColor;

  if (post.urgent == 1) {
    labelColor = "var(--warning)";
  }
  if (post.answered == 1) {
    labelColor = "var(--success)";
  }

  let leadsColor;
  if (userVoted === "useful") {
    if (post.leads >= 0) {
      leadsColor = "var(--primary)";
    } else {
      leadsColor = "var(--secondary)";
    }
  } else if (userVoted === "useless") {
    leadsColor = "var(--warning)";
  } else {
    leadsColor = "var(--secondary)";
  }

  const [disabled, setDisabled] = useState(false);
  const updateLeadsPrefs = (leads, pref) => {
    setDisabled(true);
    const time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    axios
      .post(`${PORT}post/updateleadsprefs`, {
        id: prefId,
        post_id: post.id,
        leads: leads,
        user_id: authState.id,
        pref: pref,
        time: time,
      })
      .then(async (res) => {
        setPrefId(res.data.id);
        const notification = res.data.notif;
        await socket.emit("send_notification", notification);
      });
  };

  const upVote = (e) => {
    e.preventDefault();
    if (downVoted) {
      setLeads(leads + 2);
      setUpVoted(true);
      setDownVoted(false);
      setUserVoted("useful");
      updateLeadsPrefs(2, "1");
    } else {
      if (!upVoted) {
        setLeads(leads + 1);
        setUpVoted(true);
        setUserVoted("useful");
        updateLeadsPrefs(1, "1");
      } else {
        setUserVoted("");
        setLeads(leads - 1);
        setUpVoted(false);
        updateLeadsPrefs(-1, " ");
      }
    }
  };

  const downVote = (e) => {
    e.preventDefault();
    if (upVoted) {
      setLeads(leads - 2);
      setUpVoted(false);
      setDownVoted(true);
      setUserVoted("useless");
      updateLeadsPrefs(-2, "0");
    } else {
      if (!downVoted) {
        setLeads(leads - 1);
        setDownVoted(true);
        setUserVoted("useless");
        updateLeadsPrefs(-1, "0");
      } else {
        setUserVoted("");
        setLeads(leads + 1);
        setDownVoted(false);
        updateLeadsPrefs(1, " ");
      }
    }
  };

  const rotateVariant = {
    rotate: { rotate: -20, transition: { duration: 0.2 } },
    stop: {
      rotate: 20,
    },
  };

  const description =
    post.description.length > 600 && !singlePost
      ? post.description.substring(0, 300) + " . . ."
      : post.description;

  const [postedTime, setPostedTime] = useState(
    moment(post.posted_time).local().fromNow()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPostedTime(moment(post.posted_time).local().fromNow());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="col posts-container">
      <ReactTooltip
        effect="solid"
        place="bottom"
        type="info"
        className="tooltip"
        arrowColor={"var(--secondary)"}
        delayShow={500}
      />
      <div className="hstack" style={{ alignItems: "baseline" }}>
        <Link to={`/post/${post.id}`}>
          <h5>{post.question}</h5>
        </Link>

        {(post.urgent == 1 || post.answered == 1) && (
          <div className="ms-auto">
            <span
              className="label"
              style={{
                background: labelColor,
              }}
            >
              {post.urgent == 1
                ? "Urgent"
                : post.answered == 1
                ? "Answered"
                : ""}
            </span>
          </div>
        )}

        {post.user_id == authState.id && (viewingQuestions || singlePost) && (
          <div
            className={post.urgent == 1 || post.answered == 1 ? "" : "ms-auto"}
            style={{ marginLeft: 10 }}
          >
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
              post={post}
              onDelete={onDelete}
              onToggleUrgent={onToggleUrgent}
              onToggleAnswered={onToggleAnswered}
            />
          </div>
        )}
      </div>
      <div className="hstack">
        <span
          style={{
            color: "var(--secondary)",
            fontWeight: 600,
          }}
        >
          Posted by{" "}
          <Link
            to={
              authState.nick_name == post.nick_name
                ? "/profile"
                : `/user/${post.nick_name}`
            }
          >
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>
              {post.nick_name}
            </span>
          </Link>
        </span>

        <div
          style={{
            marginLeft: 5,
            marginBottom: -3,
          }}
        >
          <i
            class="bi bi-clock-fill"
            style={{
              fontSize: 17,
              color: "var(--secondary)",
            }}
          ></i>
          <span
            style={{
              color: "var(--secondary)",
              marginLeft: 5,
            }}
            data-tip={moment(post.posted_time).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          >
            {postedTime}
          </span>
        </div>
      </div>
      {tags != null && <Tags tags={tags} tagOnly={true} />}
      <div style={{ margin: "0 auto", textAlign: "justify" }}>
        {Parser().parse(description)}
      </div>
      <hr style={{ margin: "0px 0 15px 0" }} />
      <div className="hstack" style={{ margin: "-10px 0px -10px 0px" }}>
        <div
          data-tip={`${abbreviateNumber(leads)} leads so far`}
          style={{ display: "flex", marginTop: 5 }}
        >
          <i
            class="bi bi-lightning-charge-fill"
            style={{
              fontSize: 20,
              color: leadsColor,
            }}
          ></i>
          <span
            style={{
              color: leadsColor,
              textAlign: "center",
              lineHeight: "26px",
              marginLeft: 5,
            }}
          >
            {abbreviateNumber(leads)}
          </span>
        </div>

        <div
          className="ms-auto"
          data-tip={`${abbreviateNumber(
            commentCount || post.comments
          )} answers so far`}
          style={{ display: "flex", marginTop: 5 }}
        >
          <i
            class="bi bi-chat-left-fill"
            style={{ fontSize: 17, color: "var(--secondary)" }}
          ></i>
          <span
            style={{
              color: "var(--secondary)",
              marginLeft: 10,
            }}
          >
            {abbreviateNumber(commentCount || post.comments)}
          </span>
        </div>

        <div className="ms-auto">
          <button
            className="nullBtn"
            onClick={upVote}
            data-tip="Vote as useful"
            disabled={disabled}
          >
            <i
              class="bi bi-arrow-up-short"
              style={{
                fontSize: 36,
                color:
                  userVoted === "useful"
                    ? "var(--primary)"
                    : "var(--secondary)",
              }}
            ></i>
          </button>
          <button
            className="nullBtn"
            onClick={downVote}
            data-tip="Vote as not useful"
            disabled={disabled}
          >
            <i
              class="bi bi-arrow-down-short"
              style={{
                fontSize: 36,
                color:
                  userVoted === "useless"
                    ? "var(--warning)"
                    : "var(--secondary)",
              }}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
