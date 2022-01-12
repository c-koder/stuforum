import { useState } from "react";
import Post from "./Post";
import InfiniteScoll from "react-infinite-scroll-component";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Posts = ({
  posts,
  tags,
  postPref,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
  viewingQuestions,
}) => {
  const [pageNumber, setPageNumber] = useState(0);
  const postsPerPage = 6;
  const pagesVisited = pageNumber * postsPerPage;

  const getPref = (id) => {
    return postPref.filter((pref) => {
      return pref.post_id === id;
    });
  };

  const displayPosts = posts
    .slice(0, pagesVisited + postsPerPage)
    .map((post) => {
      return (
        <Post
          key={post.id}
          post={post}
          tags={tags.filter((tag) => tag.post_id == post.id)}
          postPref={getPref(post.id)}
          onDelete={onDelete}
          onToggleUrgent={onToggleUrgent}
          onToggleAnswered={onToggleAnswered}
          viewingQuestions={viewingQuestions}
        />
      );
    });

  return (
    <div>
      <InfiniteScoll
        dataLength={pagesVisited}
        hasMore={pagesVisited < posts.length}
        next={() => {
          setTimeout(() => {
            setPageNumber(pageNumber + 1);
          }, 1000);
        }}
        loader={
          <div
            className="postsContainer"
            style={{ marginTop: viewingQuestions ? 0 : 55, marginBottom: 55 }}
          >
            <div className="postsContainer-div">
              <Skeleton
                baseColor="var(--light-white)"
                highlightColor="var(--white)"
                height={30}
              />
              <Skeleton
                baseColor="var(--light-white)"
                highlightColor="var(--white)"
                height={30}
                width={200}
              />
              <Skeleton
                baseColor="var(--light-white)"
                highlightColor="var(--white)"
                height={30}
              />
              <Skeleton
                baseColor="var(--light-white)"
                highlightColor="var(--white)"
                height={160}
              />
              <Skeleton
                baseColor="var(--light-white)"
                highlightColor="var(--white)"
                height={30}
              />
            </div>
          </div>
        }
      >
        {displayPosts}
      </InfiniteScoll>
    </div>
  );
};

export default Posts;
