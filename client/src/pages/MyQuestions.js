import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";

import usePosts from "../hooks/usePosts";
import useWindowDimensions from "../hooks/useWindowDimensions";
import FilterMenu from "../Components/FilterMenu";
import { PORT } from "../constants/Port";
import Posts from "../Components/posts/Posts";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import { containerVariants } from "../constants/Anim";

const MyQuestions = ({ socket }) => {
  const { width } = useWindowDimensions();
  const { authState } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [postPref, setPostPref] = useState([]);
  const { response } = usePosts(authState.id, true, null);

  useEffect(() => {
    if (response !== null) {
      setPosts(response.posts);
      setTags(response.tags);
      setPostPref(response.post_pref);
    }
  }, [response]);

  const deletePost = (id) => {
    axios
      .post(`${PORT}post/deletepost`, {
        post_id: id,
      })
      .then((res) => {
        if (res.data.message == "success")
          setPosts(posts.filter((post) => post.id !== id));
      });
  };

  const updateStatus = (id, status, new_status) => {
    axios.post(`${PORT}post/updatepoststatus`, {
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

  const [userQuestionCount, setUserQuestionCount] = useState(0);

  const [sortedPosts, setSortedPosts] = useState([]);
  useEffect(() => {
    setSortedPosts(posts);
  }, [posts]);

  const sortPosts = (sortBy) => {
    let obj = [...posts];

    if (sortBy == "dateasc") {
      obj.sort((a, b) => a.id - b.id);
    } else if (sortBy == "datedesc") {
      obj.sort((a, b) => b.id - a.id);
    } else if (sortBy == "leadsasc") {
      obj.sort((a, b) => a.leads - b.leads);
    } else if (sortBy == "leadsdesc") {
      obj.sort((a, b) => b.leads - a.leads);
    }

    setPosts(obj);
  };

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
    document.title = "My Questions";
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
            <strong>My Questions</strong>
          </h5>
          <br />
          {/* {posts.length > 0 && (
            <FilterMenu show={true} posts={true} sortData={sortPosts} />
          )}
          {posts.length == 0 ? (
            <div className="info-label" style={{ width: "200px" }}>
              No questions yet
            </div>
          ) : (
            <div className="info-label" style={{ width: "100px" }}>
              Sort By
            </div>
          )} */}
          <Posts
            posts={sortedPosts}
            tags={tags}
            postPref={postPref}
            onDelete={deletePost}
            onToggleUrgent={toggleUrgent}
            onToggleAnswered={toggleAnswered}
            viewingQuestions={true}
            socket={socket}
          />
        </div>
        <div className="col-3" style={{ display: width < 900 && "none" }}>
          <RightBar activeTab={"questions"} />
        </div>
      </div>
    </motion.div>
  );
};

export default MyQuestions;
