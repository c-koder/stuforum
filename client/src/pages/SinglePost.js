import { useEffect, useState } from "react";
import Post from "../Components/posts/Post";
import RightBar from "../Components/RightBar";
import { useParams } from "react-router";
import CommentBox from "../Components/CommentBox";
import Replies from "../Components/replies/Replies";
import { motion } from "framer-motion";
import useSinglePost from "../Components/dataHooks/useSinglePost";
import useReplies from "../Components/dataHooks/useReplies";
import Reply from "../Components/replies/Reply";

const SinglePost = () => {
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

  const onDelete = () => {};

  return (
    <>
      <motion.div
        className={"container"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="container-div" style={{ width: "347%" }}>
          <Post post={post} singlePost={true} />
          <CommentBox replyTo={""} />
          <Replies replies={sortedReplies} onDelete={onDelete} />
        </div>
        <div className="container-div">
          <RightBar activeTab={""} />
        </div>
      </motion.div>
    </>
  );
};

export default SinglePost;
