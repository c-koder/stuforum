import { useState, useEffect } from "react";
import axios from "axios";

const useSinglePost = (id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/getsinglepost", { post_id: id })
      .then((res) => {
        setResponse(res.data[0]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default useSinglePost;
