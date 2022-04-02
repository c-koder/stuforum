import axios from "axios";
import { useState, useEffect } from "react";
import { PORT } from "../constants/Port";

const useAllTags = () => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .get(`${PORT}tag/getalltags`)
      .then((res) => {
        setResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default useAllTags;
