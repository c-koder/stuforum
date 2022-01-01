import { useContext, useEffect, useState } from "react";
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
      scale: 0.99,
    },
    visible: {
      scale: 1,
      transition: { duration: 0.15 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  const handleChildReplyDelete = (parent_id, child_id) => {
    axios.post("http://localhost:3001/deletereply", {
      reply_id: child_id,
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

  const onDelete = (id, parent_id) => {
    if (parent_id != null) {
      handleChildReplyDelete(parent_id, id);
    } else {
      axios.post("http://localhost:3001/deletereply", {
        reply_id: id,
        delete_child_only: false,
      });
      setSortedReplies(sortedReplies.filter((reply) => reply.id !== id));
    }
  };

  const addReply = (data) => {
    // const id = Math.floor(Math.random() * 100000) + 1;
    const newReply = data;
    console.log(newReply);
    if (data.replied_to == null) {
      setSortedReplies([...sortedReplies, newReply]);
      // window.location.reload();
    } else {
      setSortedReplies(
        sortedReplies.map((reply) => {
          if (reply.id == data.parent_id || reply.id == id) {
            let childArray = reply.replies === null ? [] : reply.replies;
            childArray = [...childArray, newReply];
            return { ...reply, replies: childArray };
          } else {
            return reply;
          }
        })
      );
    }
  };

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
          <a
            href="/home"
            style={{
              backgroundColor: "var(--white)",
              padding: "20px 15px 10px 15px",
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
          </a>
        </motion.div>
        <div className="container-div" style={{ width: "347%" }}>
          <Post key={post.id} post={post} singlePost={true} />
          <CommentBox
            addReply={addReply}
            replyTo={""}
            parent_id={""}
            user_name={authState.name}
            user_id={authState.id}
            post_id={id}
          />
          <Replies
            replies={sortedReplies}
            onDelete={onDelete}
            addReply={addReply}
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
