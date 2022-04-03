import { useEffect, useState } from "react";
import InfiniteScoll from "react-infinite-scroll-component";

import MiniPost from "./MiniPost";

const MiniPosts = ({ miniPosts, searchText, scrollableTarget }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const miniPostsPerScroll = 4;
  const scrollsVisited = pageNumber * miniPostsPerScroll;
  const [hasMore, setHasMore] = useState(true);

  const [heading, setHeading] = useState("RECENT QUESTIONS");

  useEffect(() => {
    if (searchText.length > 0) {
      setHeading("SEARCH RESULTS: " + miniPosts.length);
    } else {
      setHeading("RECENT QUESTIONS");
    }
  }, [searchText, miniPosts]);

  const displayMiniPosts = miniPosts
    .slice(0, scrollsVisited + miniPostsPerScroll)
    .map((post) => {
      return <MiniPost key={post.id} post={post} />;
    });

  return (
    <div style={{ width: "100%" }}>
      <h6 style={{ letterSpacing: 1.1, marginBottom: 10, marginTop: -5 }}>
        {heading}
      </h6>
      <InfiniteScoll
        dataLength={scrollsVisited}
        hasMore={hasMore}
        scrollableTarget={scrollableTarget}
        next={() => {
          setHasMore(miniPosts[scrollsVisited] != null);
          setTimeout(() => {
            setPageNumber(pageNumber + 1);
          }, 1000);
        }}
      >
        {displayMiniPosts}
      </InfiniteScoll>
      {/* {miniPosts.slice(0, 4).map((post) => {
        return <MiniPost key={post.id} post={post} />;
      })} */}
    </div>
  );
};

export default MiniPosts;
