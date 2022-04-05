import { useState } from "react";
import Post from "./Post";
import InfiniteScoll from "react-infinite-scroll-component";
import "react-loading-skeleton/dist/skeleton.css";
import Loader from "../Loader";

const Posts = ({
  posts,
  tags,
  postPref,
  onDelete,
  onToggleUrgent,
  singlePost,
  onToggleAnswered,
  viewingQuestions,
  socket,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const postsPerScroll = 6;
  const scrollsVisited = pageNumber * postsPerScroll;
  const [hasMore, setHasMore] = useState(true);

  const getPref = (id) => {
    return postPref.find((pref) => {
      return pref.post_id == id;
    });
  };

  const displayPosts = posts
    .slice(0, scrollsVisited + postsPerScroll)
    .map((post) => {
      return (
        <Post
          key={post.id}
          post={post}
          tags={tags.filter((tag) => tag.post_id == post.id)}
          postPref={getPref(post.id)}
          onDelete={onDelete}
          singlePost={singlePost}
          onToggleUrgent={onToggleUrgent}
          onToggleAnswered={onToggleAnswered}
          viewingQuestions={viewingQuestions}
          socket={socket}
        />
      );
    });

  return (
    <div>
      <InfiniteScoll
        dataLength={scrollsVisited}
        hasMore={hasMore}
        next={() => {
          setHasMore(posts[scrollsVisited] != null);
          setTimeout(() => {
            setPageNumber(pageNumber + 1);
          }, 1000);
        }}
        loader={
          <Loader/>
        }
        endMessage={
          posts.length > 0 && (
            <div className="info-label" style={{ width: "200px" }}>
              No more questions
            </div>
          )
        }
      >
        {displayPosts}
      </InfiniteScoll>
    </div>
  );
};

export default Posts;
