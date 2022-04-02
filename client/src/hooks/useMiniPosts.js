import { useState, useEffect } from "react";
import axios from "axios";
import { PORT } from "../constants/Port";

const useMiniPosts = (count) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post(`${PORT}post/getminiposts`, {
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
