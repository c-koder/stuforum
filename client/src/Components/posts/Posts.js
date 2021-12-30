import { useState } from "react";
import Post from "./Post";
import ReactPaginate from "react-paginate";
const Posts = ({
  posts,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
  viewingQuestions,
}) => {
  const [pageNumber, setPageNumber] = useState(0);

  const postsPerPage = 6;
  const pagesVisited = pageNumber * postsPerPage;

  const displayPosts = posts
    .slice(pagesVisited, pagesVisited + postsPerPage)
    .map((post) => {
      return (
        <Post
          key={post.id}
          post={post}
          onDelete={onDelete}
          onToggleUrgent={onToggleUrgent}
          onToggleAnswered={onToggleAnswered}
          viewingQuestions={viewingQuestions}
        />
      );
    });

  const pageCount = Math.ceil(posts.length / postsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div>
      {displayPosts}
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBtns"}
          previousLinkClassName={"previousBtn"}
          nextLinkClassName={"nextBtn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      )}
    </div>
  );
};

export default Posts;
