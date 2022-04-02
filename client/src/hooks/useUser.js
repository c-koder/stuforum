import axios from "axios";
import { useState, useEffect } from "react";
import { PORT } from "../constants/Port";

const useUser = (nick_name) => {
  const [userResponse, setUserResponse] = useState(null);
  const fetchData = () => {
    axios
      .post(`${PORT}user/getuser`, {
        nick_name: nick_name,
      })
      .then((res) => {
        setUserResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { userResponse };
};

export default useUser;
