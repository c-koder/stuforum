import { useState, useEffect } from "react";
import axios from "axios";

const useSinglePost = (id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/post/getsinglepost", { post_id: id })
      .then((res) => {
        setResponse(res.data);
      });
  };

  useEffect(async () => {
    await fetchData();
  }, []);

  return { response };
};

export default useSinglePost;
