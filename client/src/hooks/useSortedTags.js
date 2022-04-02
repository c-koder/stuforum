import axios from "axios";
import { useState, useEffect } from "react";
import { PORT } from "../constants/Port";

const useSortedTags = () => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .get(`${PORT}tag/getsortedtags`)
      .then((res) => {
        setResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default useSortedTags;
