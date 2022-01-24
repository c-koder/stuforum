import axios from "axios";
import { useState, useEffect } from "react";

const useAllTags = () => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .get("https://stuforum.herokuapp.com/api/tag/getalltags")
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
