import axios from "axios";
import { useState, useEffect } from "react";

const useNotifications = (user_id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("http://localhost:3001/user/getnotifications", {
        user_id: user_id,
      })
      .then(async (res) => {
        await setResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default useNotifications;
