import { useState, useEffect } from "react";
import axios from "axios";

const usePosts = () => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios.post("http://localhost:3001/getposts").then((res) => {
      setResponse(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default usePosts;
