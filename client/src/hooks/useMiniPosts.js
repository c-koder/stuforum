import { useState, useEffect } from "react";
import axios from "axios";

const useMiniPosts = (count) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("https://stuforum.herokuapp.com/api/post/getminiposts", {
        count: count,
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

export default useMiniPosts;
