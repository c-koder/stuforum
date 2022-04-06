import Reply from "./Reply";
import InfiniteScoll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";
import Loader from "../Loader";

const Replies = ({ socket, replies, onDelete, addReply, answered }) => {
  const [scrollNumber, setScollNumber] = useState(0);
  const repliesPerPage = 8;
  const scrollsVisited = scrollNumber * repliesPerPage;
  const [hasMore, setHasMore] = useState(true);

  const displayPosts = replies
    .slice(0, scrollsVisited + repliesPerPage)
    .map((reply) => {
      return (
        <Reply
          key={reply.id}
          reply={reply}
          onDelete={onDelete}
          addReply={addReply}
          answered={answered}
          socket={socket}
        />
      );
    });

  return (
    <InfiniteScoll
      dataLength={scrollsVisited}
      hasMore={hasMore}
      next={() => {
        setHasMore(replies[scrollsVisited] != null);
        setTimeout(() => {
          setScollNumber(scrollNumber + 1);
        }, 1000);
      }}
      loader={replies.length > 0 && <Loader />}
    >
      {displayPosts}
    </InfiniteScoll>
  );
};

export default Replies;
