import ReactPaginate from "react-paginate";
import { useState } from "react";

import useWindowDimensions from "../../hooks/useWindowDimensions";
import Tag from "./Tag";

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
    <div>
      {tagOnly && display && (
        <div className="form-group my-2">
          <input
            type="text"
            placeholder="Filter by tag name"
            className="form-control shadow-none"
            value={searchTag}
            onChange={(e) => {
              setSearchTag(e.target.value);
            }}
          />
        </div>
      )}
      <div style={{ display: tagOnly && "inline-block" }}>{displayTags}</div>
      <br />
      {tagOnly && display && searchTag == "" && (
        <div className="row">
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
        </div>
      )}
    </div>
  );
};

export default Tags;
