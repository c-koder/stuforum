import upArrow from "../../resources/upArrow.png";
import upArrowBlue from "../../resources/upArrow-blue.png";
import downArrow from "../../resources/downArrow.png";
import downArrowRed from "../../resources/downArrow-red.png";
import answers from "../../resources/answers.png";
import settings from "../../resources/settings.png";
import { useRef, useEffect, useState, useContext } from "react";
import ReactTooltip from "react-tooltip";
import Tags from "../tags/Tags";
import ContextMenu from "../ContextMenu";
import { motion } from "framer-motion";
import { AuthContext } from "../../helpers/AuthContext";
import moment from "moment";
import axios from "axios";
import usePostTags from "../dataHooks/usePostTags";
import usePostPrefs from "../dataHooks/usePostPrefs";
import useUser from "../dataHooks/useUser";

const Post = ({
  post,
  singlePost,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
  viewingQuestions,
}) => {
  const { authState } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [leads, setLeads] = useState(post.leads);

  const [tags, setTags] = useState([]);
  const { tagResponse } = usePostTags(post.id);

  useEffect(() => {
    if (tagResponse !== null) {
      setTags(tagResponse);
    }
  }, [tagResponse]);

  const [userVoted, setUserVoted] = useState("");
  const [upVoted, setUpVoted] = useState();
  const [downVoted, setDownVoted] = useState();
  const [prefId, setPrefId] = useState();

  const { prefResponse } = usePostPrefs(post.id, authState.id);

  useEffect(() => {
    if (prefResponse !== null) {
      setPrefId(prefResponse.id);
      if (prefResponse.preference == "1") {
        setUserVoted("useful");
        setUpVoted(true);
        setDownVoted(false);
      } else if (prefResponse.preference == "0") {
        setUserVoted("useless");
        setUpVoted(false);
        setDownVoted(true);
      } else {
        setUserVoted("");
        setUpVoted(false);
        setDownVoted(false);
      }
    }
  }, [prefResponse]);

  const [userName, setUserName] = useState();
  const { userResponse } = useUser(post.user_id);

  useEffect(() => {
    if (userResponse !== null) {
      setUserName(userResponse.name);
    }
  }, [userResponse]);

  let labelColor;

  if (post.urgent) {
    labelColor = "var(--red)";
  }
  if (post.answered) {
    labelColor = "var(--green)";
  }

  let leadsColor;
  if (userVoted === "useful") {
    if (post.leads >= 0) {
      leadsColor = "var(--primary)";
    } else {
      leadsColor = "var(--secondary)";
    }
  } else if (userVoted === "useless") {
    leadsColor = "var(--red)";
  } else {
    if (post.leads < 0) {
      leadsColor = "var(--secondary)";
    } else {
      leadsColor = "var(--secondary)";
    }
  }

  const updateLeadsPrefs = (leads, pref) => {
    axios.post("http://localhost:3001/updateleadsprefs", {
      id: prefId,
      post_id: post.id,
      leads: leads,
      user_id: authState.id,
      pref: pref,
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
      <ReactTooltip
        effect="solid"
        place="bottom"
        type="info"
        className="tooltip"
        arrowColor={"var(--secondary)"}
        delayShow={500}
      />
      <div className="postsContainer">
        <ContextMenu
          post={post}
          show={show}
          onDelete={onDelete}
          onToggleUrgent={onToggleUrgent}
          onToggleAnswered={onToggleAnswered}
        />
        <div
          className="postsContainer-div"
          style={{
            width: "10%",
            margin: "0 10px 0 0px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            data-tip="Accumulated leads so far"
            style={{
              color: leadsColor,
            }}
          >
            {leads}
            <br />
            <span style={{ color: "var(--secondary)", fontSize: 18 }}>
              Leads
            </span>
          </h2>
        </div>
        <div className="postsContainer-div">
          {userName === authState.name && (
            <button
              ref={ref}
              style={{ float: "right" }}
              className="nullBtn"
              onClick={() => setShow((oldState) => !oldState)}
            >
              <motion.img
                style={{
                  height: "25px",
                  marginTop: 5,
                  marginLeft: 20,
                  display: viewingQuestions ? "block" : "none",
                }}
                alt="Settings"
                className="icon"
                src={settings}
                variants={rotateVariant}
                animate={show ? "rotate" : "stop"}
              />
            </button>
          )}
          {(post.urgent == 1 || post.answered == 1) && (
            <span
              className="label"
              style={{
                float: "right",
                backgroundColor: labelColor,
                marginTop: 2,
                margin: "0 auto",
              }}
            >
              {post.urgent == 1
                ? "Urgent"
                : post.answered == 1
                ? "Answered"
                : ""}
            </span>
          )}

          <a href={`/post/${post.id}`} style={{ display: "flex" }}>
            <h2 style={{ float: "left" }}>{post.question}</h2>
          </a>

          <span
            style={{
              float: "left",
              minWidth: "30%",
              color: "var(--secondary)",
              fontWeight: 600,
            }}
          >
            Posted by{" "}
            <a href={`/user/${userName}`}>
              <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                {userName}
              </span>
            </a>
          </span>
          <br />
          <Tags tags={tags} tagOnly={true} />
          <p style={{ color: "var(--gray)" }}>
            {post.description.length > 800 && !singlePost
              ? post.description.substring(0, 800) + " . . ."
              : post.description}
          </p>

          <hr style={{ margin: "15px 0" }} />

          <div style={{ display: "flex", marginBottom: 20, width: "100%" }}>
            <span
              style={{
                float: "left",
                color: "var(--secondary)",
                fontWeight: 600,
                marginTop: -5,
              }}
            >
              <h4
                style={{
                  color: "var(--secondary)",
                }}
              >
                {moment(post.posted_time).fromNow()}
              </h4>
            </span>

            <span
              style={{
                margin: "0 auto",
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              <img className="navIcon" src={answers} />
              {post.comments}
            </span>
            <span style={{ float: "right" }}>
              <button className="nullBtn" onClick={upVote}>
                <img
                  className="navIcon"
                  src={userVoted === "useful" ? upArrowBlue : upArrow}
                />
              </button>
              <button className="nullBtn" onClick={downVote}>
                <img
                  className="navIcon"
                  src={userVoted === "useless" ? downArrowRed : downArrow}
                />
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
