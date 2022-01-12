import Reply from "./Reply";
import InfiniteScoll from "react-infinite-scroll-component";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";

const Replies = ({ replies, onDelete, addReply, answered }) => {
  const [scrollNumber, setScollNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const repliesPerPage = 8;
  const scrollsVisited = scrollNumber * repliesPerPage;

  console.log(scrollsVisited);

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
        />
      );
    });

  return (
    <InfiniteScoll
      dataLength={scrollsVisited}
      next={() => {
        setTimeout(() => {
          setScollNumber(scrollNumber + 1);
          scrollsVisited <= replies.length && setHasMore(false);
        }, 1000);
      }}
      hasMore={hasMore}
      loader={
        <div className="postsContainer">
          <div
            className="postsContainer-div"
            style={{
              marginLeft: "2%",
            }}
          >
            <Skeleton
              circle
              width="5.7%"
              height="70%"
              containerClassName="avatar-skeleton"
            />
          </div>

          <div className="postsContainer-div" style={{ marginLeft: "-82%" }}>
            <Skeleton
              baseColor="var(--light-white)"
              highlightColor="var(--white)"
              height={25}
              width={250}
            />
            <Skeleton
              baseColor="var(--light-white)"
              highlightColor="var(--white)"
              height={25}
            />
            <Skeleton
              baseColor="var(--light-white)"
              highlightColor="var(--white)"
              height={25}
            />
          </div>
        </div>
      }
    >
      {displayPosts}
    </InfiniteScoll>
  );
};

export default Replies;
