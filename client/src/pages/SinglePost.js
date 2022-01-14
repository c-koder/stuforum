import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../Components/posts/Post";
import RightBar from "../Components/RightBar";
import { useParams } from "react-router";
import CommentBox from "../Components/CommentBox";
import Replies from "../Components/replies/Replies";
import { motion } from "framer-motion";
import useSinglePost from "../Components/dataHooks/useSinglePost";
import useReplies from "../Components/dataHooks/useReplies";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import FilterMenu from "../Components/FilterMenu";
import useWindowDimensions from "../Components/dataHooks/useWindowDimensions";

const SinglePost = () => {
  const { width } = useWindowDimensions();
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    axios
      .post("http://localhost:3001/postexists", { post_id: id })
      .then((res) => {
        res.data.message == null && navigate("/404");
      });
    {
    }
  }, []);

  const [post, setPost] = useState({
    id: 0,
    question: "",
    description: "",
    user_id: 0,
    nick_name: "",
    comments: 0,
    leads: 0,
    posted_time: "",
    urgent: 0,
    answered: 0,
  });
  const [tags, setTags] = useState([]);
  const [postPref, setPostPref] = useState([]);

  const { response } = useSinglePost(id);

  useEffect(() => {
    if (response !== null) {
      setPost(response.post);
      setTags(response.tags);
      setPostPref(response.post_pref);
    }
  }, [response, post]);

  const { replyResponse } = useReplies(id);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    if (replyResponse != null) {
      const populateReplies = (reply) => {
        const childs = replyResponse.filter(
          (childObj) => childObj["parent_id"] === reply["id"]
        );
        let childArray = reply.replies === null ? [] : reply.replies;
        childArray = [...childArray, ...childs];
        replyResponse.filter((reply) => reply["parent_id"] != null);
        return { ...reply, replies: childArray };
      };

      const result = replyResponse.map(populateReplies);
      setReplies(result.filter((reply) => reply.parent_id === null));
    }
  }, [replyResponse]);

  const sortReplies = (sortBy) => {
    let obj = [...replies];

    if (sortBy == "dateasc") {
      obj.sort((a, b) => a.id - b.id);
    } else if (sortBy == "datedesc") {
      obj.sort((a, b) => b.id - a.id);
    } else if (sortBy == "likesasc") {
      obj.sort((a, b) => a.likes - b.likes);
    } else if (sortBy == "likesdesc") {
      obj.sort((a, b) => b.likes - a.likes);
    }

    setReplies(obj);
  };

  useEffect(() => {
    document.title = post.question;
  });

  const containerVariants = {
    hidden: {
      scale: 0.96,
    },
    visible: {
      scale: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  const addReply = (data) => {
    const newReply = data;
    if (data.replied_to == null) {
      setReplies([...replies, newReply]);
    } else {
      setReplies(
        replies.map((reply) => {
          if (reply.id == data.parent_id) {
            let childArray = reply.replies === null ? [] : reply.replies;
            childArray = [...childArray, newReply];
            return { ...reply, replies: childArray };
          } else {
            return reply;
          }
        })
      );
    }
    setCommentUpdated(true);
  };

  const onDelete = (reply_id, parent_id) => {
    if (parent_id != null) {
      handleChildReplyDelete(reply_id);
    } else {
      axios.post("http://localhost:3001/deletereply", {
        reply_id: reply_id,
        post_id: id,
        delete_child_only: false,
      });
      setReplies(replies.filter((reply) => reply.id !== reply_id));
    }
    setCommentUpdated(true);
  };

  const handleChildReplyDelete = (reply_id) => {
    axios.post("http://localhost:3001/deletereply", {
      reply_id: reply_id,
      post_id: id,
      delete_child_only: true,
    });
    setReplies(
      replies.map((reply) => {
        const { id, replies } = reply;
        return {
          ...reply,
          replies: replies.filter(({ id }) => id !== reply_id),
        };
      })
    );
  };

  const [commentUpdated, setCommentUpdated] = useState(false);
  const [commentCount, setCommentCount] = useState();

  useEffect(() => {
    if (commentUpdated) {
      axios
        .post("http://localhost:3001/getcommentcount", { post_id: id })
        .then((res) => {
          setCommentCount(res.data.comments);
        });
    }
  });

  const deletePost = (id) => {
    axios
      .post("http://localhost:3001/deletepost", {
        post_id: id,
      })
      .then((res) => {
        if (res.data.message == "success") navigate("/home");
      });
  };

  const answered = post.answered == 1 ? true : false;

  return (
    <>
      <motion.div
        className={"container"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          padding: width < 900 && "20px 0px",
          margin: width < 900 && "20px 0px",
        }}
      >
        {/* <motion.div
          className="container-div"
          style={{ width: "0%" }}
          whileHover={{
            x: -5,
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="btn"
            style={{
              marginTop: 0,
              backgroundColor: "var(--white)",
              padding: "5px 15px 10px 15px",
              borderRadius: 10,
            }}
          >
            <img
              className="icon"
              style={{
                height: "22px",
                marginTop: 10,
              }}
              src={back}
            />
          </button>
        </motion.div> */}
        <div className="container-div" style={{ width: "347%" }}>
          <Post
            key={post.id}
            post={post}
            tags={tags}
            postPref={postPref}
            singlePost={true}
            commentCount={commentCount}
            onDelete={deletePost}
          />
          <CommentBox
            addReply={addReply}
            replyTo={null}
            parent_id={null}
            user_id={authState.id}
            nick_name={authState.nick_name}
            post_id={id}
            answered={answered}
          />

          {replies.length > 0 && (
            <div style={{ marginBottom: -20 }}>
              <FilterMenu show={true} replies={true} sortData={sortReplies} />
              <div className="sortLabel" style={{ width: "8%" }}>
                Sort By
              </div>
            </div>
          )}
          <Replies
            replies={replies}
            onDelete={onDelete}
            addReply={addReply}
            answered={answered}
          />
        </div>
        <div
          className="container-div"
          style={{ display: width < 900 && "none" }}
        >
          <RightBar activeTab={""} />
        </div>
      </motion.div>
    </>
  );
};

export default SinglePost;
