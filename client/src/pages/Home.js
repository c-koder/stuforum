import { useContext, useEffect, useState } from "react";
import Posts from "../Components/posts/Posts";
import RightBar from "../Components/RightBar";
import LeftBar from "../Components/LeftBar";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import usePosts from "../Components/dataHooks/usePosts";
import FilterMenu from "../Components/FilterMenu";
import { AuthContext } from "../helpers/AuthContext";

const Home = () => {
  const { authState } = useContext(AuthContext);
  const { name } = useParams();
  const { response } = usePosts(authState.id, false);
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [postPref, setPostPref] = useState([]);

  useEffect(() => {
    if (response !== null) {
      setPosts(response.posts);
      setTags(response.tags);
      setPostPref(response.post_pref);
    }
  }, [response]);

  const sortPosts = (sortBy) => {
    if (sortBy == "getposts") {
      setPosts(posts);
    } else if (sortBy == "getascleadsposts") {
      posts.sort((a, b) => a.leads - b.leads);
    } else if (sortBy == "getdescleadsposts") {
      posts.sort((a, b) => b.leads - a.leads);
    }
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
    document.title = "stuforum";
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={"container"}>
        <div className="container-div">
          <LeftBar />
        </div>
        <div className="container-div" style={{ width: "225%", marginTop: 0 }}>
          {posts.length > 0 && (
            <FilterMenu show={true} posts={true} sortPosts={sortPosts} />
          )}
          {posts.length == 0 ? (
            <h2>No posts yet</h2>
          ) : (
            <div className="sortLabel">Sort By</div>
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
            posts={posts}
            tags={tags}
            postPref={postPref}
            singlePost={false}
          />
        </div>
        <div className="container-div">
          <RightBar activeTab={"home"} />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
