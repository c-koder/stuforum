import { useContext, useEffect, useState } from "react";
import Posts from "../Components/posts/Posts";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import { motion } from "framer-motion";
import useUserPosts from "../Components/dataHooks/useUserPosts";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";

const MyQuestions = () => {
  const { authState } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const { userQuestionsResponse } = useUserPosts(authState.id);

  useEffect(() => {
    if (userQuestionsResponse !== null) {
      setPosts(userQuestionsResponse);
    }
  }, [userQuestionsResponse]);

  const deletePost = (id) => {
    axios
      .post("http://localhost:3001/deletepost", {
        post_id: id,
      })
      .then((res) => {
        if (res.data.message == "success")
          setPosts(posts.filter((post) => post.id !== id));
      });
  };

  const updateStatus = (id, status, new_status) => {
    axios.post("http://localhost:3001/updatepoststatus", {
      post_id: id,
      status: status,
      new_status: new_status,
    });
  };

  const toggleUrgent = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, urgent: post.urgent == 0 ? 1 : 0 } : post
      )
    );

    posts.map((post) => {
      if (post.id === id) {
        updateStatus(post.id, "urgent", post.urgent);
      }
    });
  };

  const toggleAnswered = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, answered: post.answered == 0 ? 1 : 0 }
          : post
      )
    );
    posts.map((post) => {
      if (post.id == id) {
        updateStatus(post.id, "answered", post.answered);
      }
    });
  };

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

  useEffect(() => {
    document.title = "My Questions";
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
          <Posts
            posts={posts}
            onDelete={deletePost}
            onToggleUrgent={toggleUrgent}
            onToggleAnswered={toggleAnswered}
            viewingQuestions={true}
          />
        </div>
        <div className="container-div">
          <RightBar activeTab={"questions"} />
        </div>
      </motion.div>
    </>
  );
};

export default MyQuestions;
