import { useState, useEffect } from "react";
import axios from "axios";
import { PORT } from "../constants/Port";

const usePosts = (id, userPosts, tagged) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post(`${PORT}post/getposts`, {
        user_id: id,
        user_posts: userPosts,
        tagged: tagged,
      })
      .then((res) => {
        setResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default usePosts;
