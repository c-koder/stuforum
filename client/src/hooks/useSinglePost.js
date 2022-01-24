import { useState, useEffect } from "react";
import axios from "axios";

const useSinglePost = (id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("https://stuforum.herokuapp.com/api/post/getsinglepost", {
        post_id: id,
      })
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
