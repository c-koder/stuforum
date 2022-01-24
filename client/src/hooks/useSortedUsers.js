import axios from "axios";
import { useState, useEffect } from "react";

const useSortedUsers = () => {
  const [sortedUserResponse, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .get("https://stuforum.herokuapp.com/api/user/getsortedusers")
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
