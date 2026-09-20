import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import useDelete from "@/hooks/useDelete";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";

import Status from "../status/Status";
import GlobalFilter from "./GlobalFilter";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  },
);

const CustomPaginationTable = ({
  title,
  COLUMNS,
  data,
  paginationPage = 1,
  setPaginationPage = () => {},
  limit = 10,
  setLimit = () => {},
  order = "desc",
  setOrder = () => {},
  search = "",
  setSearch = () => {},
  merchant_id,
  setMerchant_id = () => {},
  defaultSL = true,
  defaultStatus = true,
  defaultAction = true,
  addNew = true,
  isSearch = true,
  isView = true,
  isEdit = true,
  isDelete = true,
  deleteParcelByAdmin = false,
  isLogin = false,
  isToggleDropdownShow = false,
  selectedIds,
  setSelectedIds = () => {},
  create,
  isToggleBranchShow = false,
  branch_id,
  setBranch_id,
  control,
  isToggleStatusShow = false,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  isPaginationShow = true,
  isDateShow = false,
  isPrint = false,
  isExcelExport = false,
  handleExport,
}) => {
  const navigate = useNavigate();
  const { handleDelete } = useDelete();

  const columns = useMemo(
    () => [
      ...(defaultSL
        ? [
            {
              Header: "SL",
              accessor: "#",
              Cell: ({ row }) => {
                return <span>{row.index + 1}</span>;
              },
            },
          ]
        : []),

      ...COLUMNS,

      ...(defaultStatus
        ? [
            {
              Header: "Status",
              accessor: "status",
              Cell: (row) => (
                <Status
                  id={row?.cell?.row?.original?.id}
                  status={row?.cell?.value}
                />
              ),
            },
          ]
        : []),

      ...(defaultAction
        ? [
            {
              Header: "Actions",
              accessor: "id",
              Cell: (row) => {
                return (
                  <div className="flex space-x-3 rtl:space-x-reverse">
                    {isView && (
                      <Tooltip
                        content="View"
                        placement="top"
                        arrow
                        animation="shift-away"
                      >
                        <button
                          onClick={() => navigate(`${row?.cell?.value}`)}
                          className="action-btn"
                          type="button"
                        >
                          <Icon icon="heroicons:eye" />
                        </button>
                      </Tooltip>
                    )}
                    {isLogin && (
                      <Tooltip
                        content="Login"
                        placement="top"
                        arrow
                        animation="shift-away"
                      >
                        <button
                          onClick={() => navigate(`${row?.cell?.value}`)}
                          className="action-btn"
                          type="button"
                        >
                          <Icon icon="ic:round-login" />
                        </button>
                      </Tooltip>
                    )}
                    {isEdit && (
                      <Tooltip
                        content="Edit"
                        placement="top"
                        arrow
                        animation="shift-away"
                      >
                        <button
                          onClick={() => navigate(`${row?.cell?.value}/edit`)}
                          className="action-btn"
                          type="button"
                        >
                          <Icon icon="heroicons:pencil-square" />
                        </button>
                      </Tooltip>
                    )}
                    {isDelete ? (
                      <Tooltip
                        content="Delete"
                        placement="top"
                        arrow
                        animation="shift-away"
                        theme="danger"
                      >
                        <button
                          onClick={() => handleDelete(row?.cell?.value)}
                          className="action-btn"
                          type="button"
                        >
                          <Icon icon="heroicons:trash" />
                        </button>
                      </Tooltip>
                    ) : null}
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    [
      COLUMNS,
      defaultSL,
      defaultStatus,
      defaultAction,
      isView,
      isLogin,
      isEdit,
      isDelete,
    ],
  );

  const tableInstance = useTable(
    {
      columns,
      data: data?.result || [],
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    // nextPage,
    // previousPage,
    // canNextPage,
    // canPreviousPage,
    // pageOptions,
    state,
    // gotoPage,
    // pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
    selectedFlatRows, // Get selectedFlatRows from state
  } = tableInstance;

  // useEffect to update selectedIds when selectedFlatRows changes
  useEffect(() => {
    setSelectedIds(selectedFlatRows?.map((row) => row?.original));
  }, [selectedFlatRows, setSelectedIds]);

  const { globalFilter, pageIndex, pageSize } = state;
  const {
    currentPage,
    currentPageLimit,
    total,
    totalPage,
    prevPage,
    nextPage,
    prevPageLimit,
    nextPageLimit,
  } = data?.pagination || {
    currentPage: 1,
    currentPageLimit: 10,
    total: 0,
    totalPage: 1,
    prevPage: 1,
    nextPage: 1,
    prevPageLimit: 10,
    nextPageLimit: 10,
  };

  useEffect(() => {
    setPageSize(limit);
  }, [limit, setPageSize]);

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <div className="md:flex md:w-[60%] gap-10 items-center">
            <h4 className="card-title">{title}</h4>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /> */}

            {isSearch && (
              <GlobalFilter
                setPaginationPage={setPaginationPage}
                search={search}
                setSearch={setSearch}
              />
            )}
            {addNew && (
              <div>
                <Button
                  icon="heroicons-outline:plus"
                  text={create ? create : "Add New Entry"}
                  className="btn-dark dark:bg-slate-800  h-min text-sm font-normal"
                  iconClass=" text-lg"
                  onClick={() => navigate("new")}
                />
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps(),
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, cellIndex) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cellIndex === 1
                                ? // count
                                  rowIndex + 1 + limit * (paginationPage - 1)
                                : cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {isPaginationShow && (
          <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
            <div className=" flex items-center space-x-3 rtl:space-x-reverse">
              <select
                className="form-control py-2 w-max"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPageSize(Number(e.target.value));
                }}
              >
                {[1, 10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Page{" "}
                <span>
                  {currentPage} of {totalPage}
                </span>
              </span>
            </div>

            <Pagination
              currentPage={currentPage}
              handlePageChange={setPaginationPage}
              totalPages={totalPage}
              text={false}
            />
          </div>
        )}

        {/*end*/}
      </Card>
    </>
  );
};

export default CustomPaginationTable;
