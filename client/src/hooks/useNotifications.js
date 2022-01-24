import axios from "axios";
import { useState, useEffect } from "react";

const useNotifications = (user_id) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("https://stuforum.herokuapp.com/api/user/getnotifications", {
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
