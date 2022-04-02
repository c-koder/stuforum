import axios from "axios";
import { useState, useEffect } from "react";
import { PORT } from "../constants/Port";

const useSortedUsers = () => {
  const [sortedUserResponse, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .get(`${PORT}user/getsortedusers`)
      .then((res) => {
        setResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { sortedUserResponse };
};

export default useSortedUsers;
