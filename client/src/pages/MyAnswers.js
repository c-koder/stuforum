import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { AuthContext } from "../helpers/AuthContext";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { PORT } from "../constants/Port";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import Answer from "../Components/Answers";
import useAnswers from "../hooks/useAnswers";
import { containerVariants } from "../constants/Anim";

const MyAnswers = ({ socket }) => {
  const { width } = useWindowDimensions();

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
      .post(`${PORT}user/getuserpostcount`, {
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
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="row">
        <div className="col-3" style={{ display: width < 900 && "none" }}>
          <LeftBar userQuestionCount={userQuestionCount} />
        </div>
        <div className="col">
          <h5>
            <strong>My Answers</strong>
          </h5>
          <br />
          {!loading && (
            <div>
              {posts == null || replies == null ? (
                <div className="info-label" style={{ width: "300px" }}>
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
        <div className="col-3" style={{ display: width < 900 && "none" }}>
          <RightBar activeTab={"answers"} />
        </div>
      </div>
    </motion.div>
  );
};

export default MyAnswers;
