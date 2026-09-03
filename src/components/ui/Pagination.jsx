import Icon from "@/components/ui/Icon"; // Make sure to import Icon component from the correct path
import { useEffect, useState } from "react";

const Pagination = ({
  totalPages,
  currentPage,
  handlePageChange,
  text,
  className = "custom-class",
  neighborCount = 5, // Number of neighboring pages to show
  pageIncrement = 10, // Number of pages to increment by
}) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    let pages = [];
    for (let i = Math.max(1, currentPage - neighborCount); i <= Math.min(totalPages, currentPage + neighborCount); i++) {
      pages.push(i);
    }
    setPages(pages);
  }, [currentPage, totalPages, neighborCount]);

  const handlePreviousIncrement = () => {
    handlePageChange(Math.max(1, currentPage - pageIncrement));
  };

  const handleNextIncrement = () => {
    handlePageChange(Math.min(totalPages, currentPage + pageIncrement));
  };

  const isFirstSet = currentPage <= pageIncrement;

  return (
    <div className={className}>
      <ul className="pagination">
        <li>
          {text ? (
            <button
              className="text-slate-600 dark:text-slate-300 prev-next-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
          ) : (
            <button
              className="text-xl leading-4 text-slate-900 dark:text-white h-6 w-6 flex items-center justify-center flex-col prev-next-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <Icon icon="heroicons-outline:chevron-double-left" />
            </button>
          )}
        </li>

        <li>
          {text ? (
            <button
              className="text-slate-600 dark:text-slate-300 prev-next-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          ) : (
            <button
              className="text-xl leading-4 text-slate-900 dark:text-white h-6 w-6 flex items-center justify-center flex-col prev-next-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Icon icon="heroicons-outline:chevron-left" />
            </button>
          )}
        </li>

        {pages.map((page) => (
          <li key={page}>
            <button
              className={`${page === currentPage ? "active" : ""} page-link`}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          {text ? (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-slate-600 dark:text-slate-300 prev-next-btn"
            >
              Next
            </button>
          ) : (
            <button
              className="text-xl leading-4 text-slate-900 dark:text-white h-6 w-6 flex items-center justify-center flex-col prev-next-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Icon icon="heroicons-outline:chevron-right" />
            </button>
          )}
        </li>

        <li>
          {text ? (
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="text-slate-600 dark:text-slate-300 prev-next-btn"
            >
              Last
            </button>
          ) : (
            <button
              className="text-xl leading-4 text-slate-900 dark:text-white h-6 w-6 flex items-center justify-center flex-col prev-next-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <Icon icon="heroicons-outline:chevron-double-right" />
            </button>
          )}
        </li>

        {/* {isFirstSet ? (
          <li>
            <button
              onClick={handleNextIncrement}
              disabled={currentPage + pageIncrement > totalPages}
              className="text-slate-600 dark:text-slate-300 prev-next-btn"
            >
              Next {pageIncrement}
            </button>
          </li>
        ) : (
          <li>
            <button
              onClick={handlePreviousIncrement}
              disabled={currentPage <= pageIncrement}
              className="text-slate-600 dark:text-slate-300 prev-next-btn"
            >
              Previous {pageIncrement}
            </button>
          </li>
        )} */}
      </ul>
    </div>
  );
};

export default Pagination;
