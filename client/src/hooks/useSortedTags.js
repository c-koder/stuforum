import axios from "axios";
import { useState, useEffect } from "react";

const useSortedTags = () => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios.get("http://localhost:3001/tag/getsortedtags").then((res) => {
      setResponse(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default useSortedTags;
