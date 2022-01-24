import { useContext, useEffect, useState } from "react";
import Posts from "../Components/posts/Posts";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import usePosts from "../hooks/usePosts";
import FilterMenu from "../Components/FilterMenu";
import { AuthContext } from "../helpers/AuthContext";
import useWindowDimensions from "../hooks/useWindowDimensions";
import AskAQuestion from "../Components/AskAQuestion";
import Button from "../Components/Button";
import axios from "axios";

const Home = ({ socket }) => {
  const { width } = useWindowDimensions();
  const { authState } = useContext(AuthContext);
  const { name } = useParams();

  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [postPref, setPostPref] = useState([]);

  const [loading, setLoading] = useState(true);

  const { response } = usePosts(authState.id, false, name);

  useEffect(() => {
    if (response !== null) {
      setPosts(response.posts);
      setTags(response.tags);
      setPostPref(response.post_pref);
    }
    setLoading(false);
  }, [response]);

  const [sortedPosts, setSortedPosts] = useState([]);
  useEffect(() => {
    setSortedPosts(posts);
  }, [posts]);

  const [userQuestionCount, setUserQuestionCount] = useState(0);

  useEffect(() => {
    axios
      .post("https://stuforum.herokuapp.com/api/user/getuserpostcount", {
        user_id: authState.id,
      })
      .then((res) => {
        setUserQuestionCount(res.data[0].count);
      });
  }, []);

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

  const [questionPopup, setQuestionPopup] = useState(false);

  const askQuestion = (e) => {
    e.preventDefault();
    setQuestionPopup(true);
  };

  useEffect(() => {
    document.title = "stuforum";
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        padding: width < 900 && "0px 0px",
        margin: width < 900 && "0px 0px",
      }}
    >
      {questionPopup && (
        <AskAQuestion
          questionPopup={questionPopup}
          setQuestionPopup={setQuestionPopup}
        />
      )}
      {width < 900 && (
        <div style={{ margin: "40px" }}>
          <Button onClick={askQuestion} text={"Ask a Question"} />
        </div>
      )}

      <div className={"container"}>
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
            marginTop: width < 900 ? "-80px" : 0,
          }}
        >
          {!loading && (
            <div>
              {posts.length > 0 && (
                <FilterMenu show={true} posts={true} sortData={sortPosts} />
              )}
              {posts.length == 0 ? (
                <div className="sortLabel" style={{ width: "200px" }}>
                  No questions yet
                </div>
              ) : (
                <div className="sortLabel" style={{ width: "100px" }}>
                  Sort By
                </div>
              )}
              {name != null && (
                <div
                  style={{
                    display: "flex",
                    marginBottom: 20,
                  }}
                >
                  <h3 style={{ color: "var(--secondary)", marginTop: 8 }}>
                    Tagged
                  </h3>
                  <a
                    href={{
                      pathname: `/home/tagged/${name}`,
                    }}
                    style={{ marginLeft: 20 }}
                    className="tag"
                  >
                    {name}
                  </a>
                </div>
              )}
              <Posts
                posts={sortedPosts}
                tags={tags}
                postPref={postPref}
                singlePost={false}
                socket={socket}
              />
            </div>
          )}
        </div>
        <div
          className="container-div"
          style={{ display: width < 900 && "none" }}
        >
          <RightBar activeTab={"home"} />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
