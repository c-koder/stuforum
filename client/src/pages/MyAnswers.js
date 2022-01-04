import { useContext, useEffect, useState } from "react";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import Answer from "../Components/Answer";
import useAnswers from "../Components/dataHooks/useAnswers";
import { motion } from "framer-motion";
import { AuthContext } from "../helpers/AuthContext";

const MyAnswers = () => {
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

  const { authState } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const { response } = useAnswers(authState.id);

  useEffect(() => {
    if (response !== null) {
      setPosts(response.posts);
      setReplies(response.replies);
    }
  }, [response]);

  const deleteReply = (id) => {
    const reply = replies.find((reply) => {
      if (reply.id === id) return reply.post_id;
    });
    setReplies(replies.filter((reply) => reply.id !== id));
    setPosts(posts.filter((post) => post.id !== reply.post_id));
  };

  useEffect(() => {
    document.title = "My Answers";
  }, []);

  return (
    <>
      <motion.div
        className={"container"}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="container-div">
          <LeftBar />
        </div>
        <div className="container-div" style={{ width: "225%" }}>
          <Answer
            posts={posts}
            singlePost={false}
            replies={replies}
            onDelete={deleteReply}
          />
        </div>
        <div className="container-div">
          <RightBar activeTab={"answers"} />
        </div>
      </motion.div>
    </>
  );
};

export default MyAnswers;
