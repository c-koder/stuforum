import Tag from "./Tag";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import useWindowDimensions from "../dataHooks/useWindowDimensions";

const Tags = ({ tags, tagOnly, display }) => {
  const { width } = useWindowDimensions();
  const [pageNumber, setPageNumber] = useState(0);

  const tagsPerPage = 60;
  const pagesVisited = pageNumber * tagsPerPage;

  const [searchTag, setSearchTag] = useState("");

  const displayTags = tags
    .slice(pagesVisited, pagesVisited + tagsPerPage)
    .filter((val) => {
      if (searchTag == "") {
        return val;
      } else if (val.name.toLowerCase().includes(searchTag.toLowerCase())) {
        return val;
      }
    })
    .map((tag) => {
      return <Tag key={tag.id} tag={tag} tagOnly={tagOnly} display={display} />;
    });
  //

  const pageCount = Math.ceil(tags.length / tagsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <>
      {tagOnly && display && (
        <div className="form-control">
          <input
            style={{
              width: width < 900 ? "70%" : "30%",
              paddingLeft: 40,
              marginLeft: 0,
            }}
            className="searchInput"
            type="text"
            onChange={(e) => {
              setSearchTag(e.target.value);
            }}
            placeholder="Filter by tag name"
          ></input>
        </div>
      )}

      <div style={{ display: tagOnly && "inline-block" }}>{displayTags}</div>
      <br />
      {tagOnly && display && searchTag == "" && (
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
    </>
  );
};

export default Tags;
