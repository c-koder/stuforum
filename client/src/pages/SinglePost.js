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
import back from "../resources/backArrow.png";
import axios from "axios";

const SinglePost = () => {
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const { id } = useParams();

  const [post, setPost] = useState({
    id: 0,
    question: "",
    description: "",
    user_id: 0,
    user_name: "",
    comments: 0,
    leads: 0,
    posted_time: "",
    urgent: 0,
    answered: 0,
  });

  const { response } = useSinglePost(id);

  useEffect(() => {
    if (response !== null) {
      setPost(response);
    }
  }, [response]);

  const { replies, childReplies } = useReplies(id);
  const [sortedReplies, setSortedReplies] = useState([]);

  useEffect(() => {
    if (replies !== null && childReplies !== null) {
      const populateReplies = (obj) => {
        const childs = childReplies.filter(
          (childObj) => childObj["parent_id"] === obj["id"]
        );
        let childArray = obj.replies === null ? [] : obj.replies;
        childArray = [...childArray, ...childs];
        return { ...obj, replies: childArray };
      };

      const result = replies.map(populateReplies);
      setSortedReplies(result);
    }
  }, [replies, childReplies]);

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
      setSortedReplies([...sortedReplies, newReply]);
    } else {
      setSortedReplies(
        sortedReplies.map((reply) => {
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
      handleChildReplyDelete(reply_id, parent_id);
    } else {
      axios.post("http://localhost:3001/deletereply", {
        reply_id: reply_id,
        post_id: id,
        delete_child_only: false,
      });
      setSortedReplies(sortedReplies.filter((reply) => reply.id !== reply_id));
    }
    setCommentUpdated(true);
  };

  const handleChildReplyDelete = (child_id, parent_id) => {
    axios.post("http://localhost:3001/deletereply", {
      reply_id: child_id,
      post_id: id,
      delete_child_only: true,
    });
    setSortedReplies(
      sortedReplies.map((reply) => {
        const { id, replies } = reply;
        if (id !== parent_id) {
          return reply;
        }
        return {
          ...reply,
          replies: replies.filter(({ id }) => id !== child_id),
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
      >
        <motion.div
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
        </motion.div>
        <div className="container-div" style={{ width: "347%" }}>
          <Post
            key={post.id}
            post={post}
            singlePost={true}
            commentCount={commentCount}
            onDelete={deletePost}
          />
          <CommentBox
            addReply={addReply}
            replyTo={null}
            parent_id={""}
            user_id={authState.id}
            post_id={id}
            answered={answered}
          />
          <Replies
            replies={sortedReplies}
            onDelete={onDelete}
            addReply={addReply}
            answered={answered}
          />
        </div>
        <div className="container-div">
          <RightBar activeTab={""} />
        </div>
      </motion.div>
    </>
  );
};

export default SinglePost;
