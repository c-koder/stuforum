import { useContext, useEffect, useState } from "react";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import Answer from "../Components/Answers";
import useAnswers from "../hooks/useAnswers";
import { motion } from "framer-motion";
import { AuthContext } from "../helpers/AuthContext";
import useWindowDimensions from "../hooks/useWindowDimensions";
import axios from "axios";

const MyAnswers = ({ socket }) => {
  const { width } = useWindowDimensions();

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
  const [tags, setTags] = useState([]);
  const [postPref, setPostPref] = useState([]);

  const [loading, setLoading] = useState(true);

  const { response } = useAnswers(authState.id);

  useEffect(() => {
    if (response !== null) {
      setPosts(response.posts);
      setReplies(response.replies);
      setTags(response.tags);
      setPostPref(response.post_pref);
      console.log(response);
    }
    setLoading(false);
  }, [response]);

  const deleteReply = (id) => {
    const reply = replies.find((reply) => {
      if (reply.id === id) return reply.post_id;
    });
    setReplies(replies.filter((reply) => reply.id !== id));
    setPosts(posts.filter((post) => post.id !== reply.post_id));
  };

  const [userQuestionCount, setUserQuestionCount] = useState(0);

  useEffect(() => {
    axios
      .post("http://localhost:3001/user/getuserpostcount", {
        user_id: authState.id,
      })
      .then((res) => {
        setUserQuestionCount(res.data[0].count);
      });
  }, []);

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
        <div
          className="container-div"
          style={{ display: width < 900 && "none" }}
        >
          <LeftBar userQuestionCount={userQuestionCount} />
        </div>
        <div
          className="container-div"
          style={{
            width: "225%",
            margin: width < 900 && "-80px 0px 0px 0px",
            marginTop: width < 900 ? "-40px" : 0,
          }}
        >
          {!loading && (
            <div>
              {posts == null || replies == null ? (
                <div className="sortLabel" style={{ width: "300px" }}>
                  You haven't answered any yet
                </div>
              ) : (
                <Answer
                  posts={posts}
                  socket={socket}
                  replies={replies}
                  tags={tags}
                  postPref={postPref}
                  singlePost={false}
                  onDelete={deleteReply}
                />
              )}
            </div>
          )}
        </div>
        <div
          className="container-div"
          style={{ display: width < 900 && "none" }}
        >
          <RightBar activeTab={"answers"} />
        </div>
      </motion.div>
    </>
  );
};

export default MyAnswers;
