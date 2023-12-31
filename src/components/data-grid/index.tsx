import { t } from "i18next";
import {
  ArrowDown2,
  Calendar,
  ExportSquare,
  RowHorizontal,
  SearchNormal,
} from "iconsax-react";
import { BsFilter } from "react-icons/bs";
import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useAsyncDebounce } from '../../hooks';
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { Popover } from "@mantine/core";

import {
  addToObj,
  exportToCSV,
  get_nested_value,
  insert,
  isDeepEqual,
  useDebouncedEffect,
} from "../../utils/functions";
import { DateRanges, Pagination } from "..";

// Data Headers
export interface Header {
  name: string;
  accessor: string;
  hidden: boolean;
  sortable: boolean;
  static: boolean;
  secondary_key?: string;
  tertiary_key?: string;
  cell?: (val: any, second?: any) => JSX.Element;
  cellAlign?: "left" | "right" | "center";
  row?: (val: any, second?: any, third?: any) => JSX.Element;
  rowAlign?: "left" | "right" | "center";
  actionCell?: (data: ArrayElement<any[]>) => JSX.Element;
}

export interface HeaderFilter {
  name: string;
  accessor: string;
}

// Table properties (Required)
interface DataGridRequiredProps {
  data: any[];
  headers: Header[];
  dateFilter: {
    enabled: boolean;
    accessor: string;
    label: string;
  };
  headerFilter: HeaderFilter[];
  rows: number;
  loadMore: (page: number) => void;
  lastPage: number;
  total: number;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

interface ActionComponentProps {
  data: ArrayElement<any[]>;
}

// Table properties (Optional)
interface DataGridOptionalProps {
  title?: string;
  tableTitle?: string;
  withGlobalFilters?: boolean;
  filterKeys?: string[];
  withHeaderActionComponent?: boolean;
  HeaderActionComponent?: JSX.Element;
  withExport?: boolean;
  withActions?: boolean;
  withCheck?: boolean;
  ActionComponent?: (props: ActionComponentProps) => JSX.Element;
  withNavigation?: boolean;
  withRowNavigation?: boolean;
  navigationProps?: { baseRoute: string; accessor: string };
  setSelectedData?: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedEntries?: React.Dispatch<React.SetStateAction<any>>;
}

type DataGridProps = DataGridRequiredProps & DataGridOptionalProps;

const DataGrid = ({
  data,
  headers,
  headerFilter,
  rows,
  dateFilter,
  ...props
}: DataGridProps) => {
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const [availableData, setAvailableData] = useState<typeof data>(data);
  const table = React.useMemo(() => data, [data]);
  // const [currentUsers, setCurrentUsers] = useState<typeof data>(data);
  const [selectedColumns, setSelectedColumns] = useState(headers);
  // Column visibility
  const [showColOpts, setShowColOpts] = useState<boolean>(false); // Column options
  const [showAllComp, setshowAllComp] = useState<boolean>(false); // Column options
  const [showFilterColOpts, setShowFilterColOpts] = useState<boolean>(false); // Column options
  // const [_internal, setInternal] = useState<typeof data>(data); // Data Mainpulation
  const [selectedRows, setSelectedRows] = useState<typeof data>([]); // Data Selection
  const [start, setStart] = useState<Date | null>(null); // Date Range Start
  const [end, setEnd] = useState<Date | null>(null); // Date Range End
  const [showDateCalendar, setShowDateCalendar] = useState<boolean>(false); // Show Date Calendar

  //filter parameters state
  const [checkboxState, setCheckboxState] = useState({
    isChecked: false,
    value: "",
  });
  const [inputValue, setInputValue] = useState("");
  const filterData = addToObj(checkboxState.value, inputValue);

  // useEffect(() => {
  //   props.setFilters(filterData);
  // }, [filterData]);

  const [opened, setOpened] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const [openCsv, setOpenCsv] = useState(false);

  // const debounceSearch = useAsyncDebounce;
  const useSortableData = (items: any, config: any) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
      let sortableItems = items;
      if (sortConfig !== null) {
        sortableItems?.sort((a: any, b: any) => {
          // Check if the values are numbers
          const aValueIsNumber = !isNaN(parseFloat(a[sortConfig.key]));
          const bValueIsNumber = !isNaN(parseFloat(b[sortConfig.key]));

          if (aValueIsNumber && bValueIsNumber) {
            // If both values are numbers, compare them numerically
            return parseFloat(a[sortConfig.key].replace(/,/g, "")) -
              parseFloat(b[sortConfig.key].replace(/,/g, "")) >
              0
              ? sortConfig.direction === "ascending"
                ? 1
                : -1
              : sortConfig.direction === "ascending"
              ? -1
              : 1;
          } else if (aValueIsNumber) {
            // If only the first value is a number, sort it before the second value
            return sortConfig.direction === "ascending" ? -1 : 1;
          } else if (bValueIsNumber) {
            // If only the second value is a number, sort it before the first value
            return sortConfig.direction === "ascending" ? 1 : -1;
          } else {
            // If neither value is a number, compare them as strings
            const aVal =
              a[sortConfig.key] !== undefined ? a[sortConfig.key] : "";
            const bVal =
              b[sortConfig.key] !== undefined ? b[sortConfig.key] : "";
            if (aVal < bVal) {
              return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aVal > bVal) {
              return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
          }
        });
      }
      return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: any) => {
      let direction = "ascending";
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
  };

  const { requestSort, sortConfig } = useSortableData(availableData, "");
  const getClassNamesFor = (name: any) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  getClassNamesFor("");

  // Pagination Controls // Rows per page // Current list displayed

  // Select/Deselect a particular row
  const toggleRow = (row: ArrayElement<typeof data>) => {
    if (selectedRows.includes(row)) {
      setSelectedRows((prev) => prev.filter((el) => !isDeepEqual(el, row)));
    } else {
      setSelectedRows((prev) =>
        insert(
          prev,
          data.findIndex((el) => isDeepEqual(el, row)),
          row
        )
      );
    }
    if (props.setSelectedData) {
      if (selectedRows.includes(row)) {
        props.setSelectedData((prev) =>
          prev.filter((el) => !isDeepEqual(el, row))
        );
      } else {
        props.setSelectedData((prev) =>
          insert(
            prev,
            data.findIndex((el) => isDeepEqual(el, row)),
            row
          )
        );
      }
    }
  };

  const selectCurrent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    if (checked) {
      setSelectedRows(data);
      if (props.setSelectedData) {
        props.setSelectedData(data);
      }
    } else {
      setSelectedRows([]);
      props.setSelectedData?.([]);
    }
  };

  // Select current displayed rows
  // const selectCurrent = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { checked } = e.currentTarget;
  //   if (checked) {
  //     setSelectedRows(data);
  //   } else {
  //     setSelectedRows([]);
  //   }
  // };

  // Filter Date use******
  const filterByDate = useCallback(() => {
    if (!start || !end) return;
    setAvailableData(
      table
        .slice()
        .filter(
          (el) =>
            new Date(el[dateFilter.accessor]).getTime() >= start.getTime() &&
            new Date(el[dateFilter.accessor]).getTime() <= end.getTime()
        )
    );
  }, [table, dateFilter.accessor, start, end]);

  // Column Visibility
  const toggleVisibility = (header: Header) => {
    if (header.static) return;

    setSelectedColumns((prev) =>
      prev.map((el) => {
        if (el.accessor === header.accessor) {
          return {
            ...el,
            hidden: !el.hidden,
          };
        }
        return el;
      })
    );
  };

  // const SelectIds = () => {
  //   props.setSelectedData(selectedRows.map((el) => el!?.id));
  // };
  //Search Filter Function
  // const handleInputChange = (event: {
  //   target: { value: React.SetStateAction<string> };
  // }) => {
  //   setInputValue(event.target.value);
  // };

  useDebouncedEffect(
    () => {
      document.addEventListener("click", () => {
        setShowColOpts(false);
        setshowAllComp(false);

        setShowFilterColOpts(false);
      });

      return () => {
        document.removeEventListener("click", () => {
          setShowColOpts(false);
          setshowAllComp(false);

          setShowFilterColOpts(false);
        });
      };
    },
    [],
    50
  );

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const newValue = event.target.value;
    const isActive = newValue === "active";

    setInputValue(
      isActive ? "true" : newValue === "inactive" ? "false" : newValue
    );
  };

  // Searching for any text
  // const filterByTextSearch = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { value } = e.currentTarget;
  //     setAvailableData(() => searchText(data, value));
  //   },
  //   [data]
  // );

  //

  useEffect(() => {
    setAvailableData(data);
  }, [data]);

  // PDF EXPORT
  const printCurrent = useRef(null);
  const printSelected = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printCurrent.current,
    documentTitle: "cuddie_client_table",
  });
  // const handlePrintAllData = useReactToPrint({
  //   content: () => printAllData.current,
  //   documentTitle: 'cuddie_client_table',
  // });
  const handlePrintSelected = useReactToPrint({
    content: () => printSelected.current,
    documentTitle: "cuddie_client_table",
  });

  return (
    <section className="h-full relative">
      {/* Top Task Bar */}

      <div className="w-full flex justify-end gap-3 pb-2 items-center">
        {/* GENERAL SEARCH */}
        <div className="relative flex items-center w-72 2xl:w-96 ml-[60%] ">
          <input
            type="text"
            placeholder={props.title}
            className="py-2 mx-2 w-full text-base bg-white placeholder:text-sinbadKYC-lightGrey rounded-lg px-10 pr-14 border border-sinbadKYC-bordergrey focus:ring-1 outline-none  focus:ring-gray-100  hover:shadow "
            onChange={(e) => props.setSearch(e.currentTarget.value)}
          />
          <span className="absolute left-4 text-2xl">
            <SearchNormal size="18" color="#8f8e91" />
          </span>
        </div>

        {/* FILTER ACTION */}
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className={`h-full whitespace-nowrap bg-white  gap-1 2xl:gap-2 text-[12px] 2xl:text-[14px] p-3 rounded-lg  w-full hover:cursor-pointer text-sinbadKYC-grey font-medium flex justify-center  items-center border  border-sinbadKYC-bordergrey capitalize ${
              showAllComp
                ? " border-sinbadKYC-bordergrey"
                : "border-sinbadKYC-bordergrey"
            }`}
            onClick={() => {
              setshowAllComp(false);
              setShowColOpts(false);
              setShowDateCalendar(false);
            }}
          >
            <BsFilter />
            {t("Filters")}
          </button>
          {/* ALL COMPONENTS TO BE DISPLAYED */}
          <div
            className={`flex gap-2  w-[340px] bg-white px-4 py-2 flex-col absolute top-[100%] right-[30%] ring-1 ring-white shadow-md rounded-xl opacity-0  z-10 max-h-0 overflow-hidden transition-[max-height] duration-300 ${
              showAllComp && "max-h-[450px] opacity-100 overflow-scroll"
            }`}
          >
            {/* COLUMNS HEADER */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                className={`h-full w-full dark:text-textgrey-normal whitespace-nowrap gap-2 text-base p-4 rounded-lg hover:shadow hover:cursor-pointer font-semibold flex justify-between items-center border dark:bg-afexdark-verydark dark:border-0 capitalize ${
                  showFilterColOpts ? " border-[#DAD9DA]" : "  border-[#DAD9DA]"
                }`}
                onClick={() => setShowFilterColOpts((s) => !s)}
              >
                {"SELECT COLUMNS"}
                <ArrowDown2
                  size="16"
                  color="#7738DD"
                  variant="Bulk"
                  className="shrink-0 "
                />
              </button>
              <ul
                className={`flex gap-1 w-full px-1 py-2 flex-col absolute  dark:bg-afexdark-darkest bg-white top-[110%] ring-1 ring-white shadow-md dark:ring-wdark-500 rounded-xl opacity-0 dark:bg-wdark-300 z-10 max-h-0 overflow-hidden transition-[max-height] duration-300 ${
                  showFilterColOpts && "max-h-[300px] opacity-100 "
                }`}
              >
                {headerFilter.map((header) => (
                  <label
                    key={header.name}
                    htmlFor={header.name}
                    className={`flex items-center gap-1 whitespace-nowrap  text-gray-900 dark:text-textgrey-normal text-base cursor-pointer m-1 rounded-md py-2 px-4 capitalize ${
                      checkboxState.value === header.accessor &&
                      "bg-afexpurple-lighter"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      name={header.accessor}
                      id={header.accessor}
                      checked={checkboxState.value === header.accessor}
                      onClick={() => {
                        setCheckboxState({
                          isChecked: true,
                          value: header.accessor,
                        });
                      }}
                    />
                    {header.name}{" "}
                  </label>
                ))}
              </ul>
            </div>

            {/* SEARCH SECTION */}
            <div className="w-full">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Input Query Value"
                  className="py-3  w-full text-base rounded-lg px-10 pr-14 border focus:ring-1 outline-none  focus:ring-[#DAD9DA] hover:shadow bg-white"
                  value={inputValue}
                  onChange={handleInputChange}
                  // onChange={(e) => props.setSearch(e.currentTarget.value)}
                />
              </div>
              {/* BUTTONS */}
              <div className="flex justify-end gap-2 py-5 w-full">
                <span
                  onClick={() => {
                    setCheckboxState({ isChecked: false, value: "" });
                    props.setFilters("");
                    setInputValue("");
                    setAvailableData(data);
                    setshowAllComp((s) => !s);
                  }}
                  className="p-3 rounded-lg text-center w-[80px] bg-textgrey-light   text-textgrey-darker"
                >
                  {t("Clear")}
                </span>
                <span
                  onClick={() => {
                    props.setFilters(filterData);
                    setshowAllComp((s) => !s);
                  }}
                  className="p-3 rounded-lg text-center w-[80px] bg-afexpurple cursor-pointer text-white "
                >
                  {t("Add")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE ACTIONS */}

        <div className="hidden text-gray-300 flex-1 items-center gap-2 relative ">
          {/* COLUMN VISIBILITY FILTER */}
          <div className="relative hidden" onClick={(e) => e.stopPropagation()}>
            <button
              className={`h-full whitespace-nowrap bg-afexpurple-lighter dark:bg-afexdark-verydark gap-1 2xl:gap-2 text-[12px] 2xl:text-[14px] p-3 2xl:p-4 rounded-lg hover:shadow w-28 2xl:w-full hover:cursor-pointer text-afexpurple-regular font-semibold flex justify-center  items-center border dark:border-0 capitalize ${
                showColOpts
                  ? " border-afexpurple-regular  "
                  : " border-transparent"
              }`}
              onClick={() => {
                setShowColOpts((s) => !s);
                setshowAllComp(false);

                setShowDateCalendar(false);
              }}
            >
              <RowHorizontal
                size="16"
                color="#7738DD"
                variant="Bulk"
                className="shrink-0 "
              />
              {t("COLUMNS")}
            </button>
            <ul
              className={`flex gap-2 w-[200px] px-1 py-2 flex-col absolute top-[110%] ring-1 ring-white shadow-md dark:ring-afexdark-verydark  rounded-xl opacity-0 bg-white dark:bg-afexdark-darkest  z-10 max-h-0 overflow-hidden transition-[max-height] duration-300 ${
                showColOpts && "max-h-[300px] opacity-100 overflow-scroll"
              }`}
            >
              {headers.map((header) => (
                <label
                  key={header.name}
                  htmlFor={header.name}
                  className={`flex items-center gap-1 whitespace-nowrap  text-gray-900 dark:text-textgrey-normal text-base cursor-pointer m-1 rounded-md py-4 px-4 capitalize ${
                    selectedColumns.findIndex(
                      (el) => el.name === header.name && !el.hidden
                    ) >= 0 && !header.static
                      ? "bg-afexpurple-lighter dark:bg-afexdark-verydark"
                      : selectedColumns.findIndex(
                          (el) => el.name === header.name
                        ) >= 0 && header.static
                      ? " bg-afexpurple-lighter dark:bg-afexdark-verydark  cursor-not-allowed"
                      : undefined
                  }`}
                >
                  <input
                    className="checkbox"
                    type="checkbox"
                    name={header.name}
                    id={header.name}
                    disabled={header.static}
                    checked={
                      selectedColumns.findIndex(
                        (el) => el.name === header.name && !el.hidden
                      ) >= 0
                    }
                    onChange={() => toggleVisibility(header)}
                  />
                  {header.name}{" "}
                </label>
              ))}
            </ul>
          </div>

          {/* {props.withGlobalFilters && (
            <button
              className='flex bg-afexpurple-lighter font-semibold justify-between items-center rounded-lg py-4 px-4 text-sm  gap-2 border-[1px] border-none  text-afexpurple-regular  hover:shadow p-2  hover:text-afex-regular'
              onClick={() => setShowFilter(true)}>
              <Filter size={18} variant='Bold' />
              {t('FIlTER')}
            </button>
          )} */}

          {/* EXPORT ACTIONS */}
          <Popover
            opened={opened}
            onChange={setOpened}
            width={100}
            position={"bottom-end"}
          >
            <Popover.Target>
              <button
                className="hidden font-semibold  items-center gap-1 2xl:gap-2 text-[12px] 2xl:text-[14px] p-3 2xl:p-4 rounded-lg text-afexpurple-regular  bg-afexpurple-lighter"
                onClick={() => {
                  setOpened((o) => !o);
                }}
              >
                <ExportSquare size="18" color="#7738DD" variant="Bulk" />
                <span>{t("EXPORT")}</span>
              </button>
            </Popover.Target>

            <Popover.Dropdown>
              {/* PDF POPOVER */}
              <Popover
                opened={openPdf}
                onChange={setOpenPdf}
                width={140}
                position="left-start"
              >
                <Popover.Target>
                  <button
                    className=" flex items-center gap-1 cursor-pointer text-textgrey-dark hover:bg-afexpurple-lighter  rounded-lg py-4 px-2 font-normal text-[14px] text-left"
                    onClick={() => {
                      setOpenPdf((o) => !o);
                    }}
                  >
                    PDF
                  </button>
                </Popover.Target>

                <Popover.Dropdown>
                  <span
                    className="text-[12px] cursor-pointer p-2 hover:bg-afexpurple-lighter rounded text-textgrey-dark"
                    onClick={() => {
                      handlePrintSelected();

                      setOpenPdf((o) => !o);
                      setOpened((o) => !o);
                    }}
                  >
                    {t("Export Selected")}
                  </span>
                  <span
                    className="text-[12px] cursor-pointer p-2 hover:bg-afexpurple-lighter rounded text-textgrey-dark"
                    onClick={() => {
                      handlePrint();
                      setOpenPdf((o) => !o);
                      setOpened((o) => !o);
                    }}
                  >
                    {t("Export Page")}
                  </span>
                </Popover.Dropdown>
              </Popover>
              {/* CSV POPOVER */}
              <Popover
                opened={openCsv}
                onChange={setOpenCsv}
                width={140}
                position="left-start"
              >
                <Popover.Target>
                  <button
                    className=" flex items-center gap-1 cursor-pointer text-textgrey-dark hover:bg-afexpurple-lighter rounded-lg py-4 px-2 font-normal text-[14px] text-left"
                    onClick={() => {
                      setOpenCsv((o) => !o);
                    }}
                  >
                    {" "}
                    CSV
                  </button>
                </Popover.Target>

                <Popover.Dropdown>
                  <span
                    className="text-[12px] cursor-pointer p-2 hover:bg-afexpurple-lighter rounded text-textgrey-dark"
                    onClick={() => {
                      exportToCSV(
                        selectedRows,
                        selectedColumns
                          .filter((el) => el.hidden)
                          .map((el) => el.accessor)
                      );
                      setOpenCsv((o) => !o);
                      setOpened((o) => !o);
                    }}
                  >
                    {t("Export Selected")}
                  </span>
                  <span
                    className="text-[12px] cursor-pointer p-2 hover:bg-afexpurple-lighter rounded text-textgrey-dark"
                    onClick={() => {
                      exportToCSV(
                        data,
                        selectedColumns
                          .filter((el) => el.hidden)
                          .map((el) => el.accessor)
                      );
                      setOpenCsv((o) => !o);
                      setOpened((o) => !o);
                    }}
                  >
                    {t("Export Page")}
                  </span>
                </Popover.Dropdown>
              </Popover>
            </Popover.Dropdown>
          </Popover>

          {/* DATE FILTER ACTION */}
          {dateFilter.enabled && (
            <button
              className="hidden items-center gap-1 2xl:gap-2 text-[12px] 2xl:text-[14px] p-3 2xl:p-4 rounded-xl focus:outline-none focus:border-afexgreen hover:shadow bg-afexpurple-lighter cursor-pointer"
              onClick={() => {
                setShowDateCalendar((s) => !s);
                setShowColOpts(false);
                setshowAllComp(false);
              }}
            >
              {/* <span className='capitalize whitespace-nowrap'>
                {dateFilter.label}{' '}
              </span> */}
              <span>
                <Calendar color="#7738DD" variant="Bulk" />
              </span>
            </button>
          )}
          {showDateCalendar && dateFilter.enabled && (
            <DateRanges
              startDate={start}
              endDate={end}
              setEndDate={setEnd}
              setStartDate={setStart}
              close={() => setShowDateCalendar(false)}
              filterFunc={filterByDate}
            />
          )}

          {props.withHeaderActionComponent && props.HeaderActionComponent}
        </div>
      </div>

      {/* Table */}
      <div className="h-full">
        <div className="h-[40rem] xl:h-[50rem] relative">
          <style type="text/css">
            {`
          @media print {
            .table {
              font-size: 16px;
              width: 100%;
            }
             td {
             
            }
            th {
              background-color: #E1261C;
            
              
            }
          }
        `}
          </style>
          <div className="h-[96%] table-auto border border-sinbadKYC-bordergrey  rounded-lg overflow-auto  w-full my-1">
            <table className="overflow-auto p-5  w-full mb-10 align-top">
              <thead className="sticky top-0 text-left whitespace-nowrap bg-sinbadKYC-primaryGrey rounded-lg  z-[5]">
                <tr className="child:px-3 border-b  child:py-3 child:text-sinbadKYC-lightGrey  font-normal child:cursor-default child:align-middle capitalize">
                  {props?.withCheck && (
                    <th className="align-middle w-8 ">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={
                          selectedRows?.length === data?.length &&
                          selectedRows?.length !== 0
                        }
                        onChange={selectCurrent}
                      />
                    </th>
                  )}
                  <th className="w-8">S/N</th>
                  {selectedColumns?.map((column) => (
                    <th
                      key={column.accessor}
                      className={`${column.hidden && "hidden"}`}
                    >
                      {column.cell
                        ? column.cell(column.name)
                        : column.name.toLowerCase()}
                      {
                        <span
                          className="#C1C0C2"
                          onClick={() => requestSort(`${column.accessor}`)}
                        >
                          {" "}
                          &uarr;&darr;
                        </span>
                      }
                    </th>
                  ))}
                  {props?.withActions && <th>{"action"}</th>}
                </tr>
              </thead>

              {data!?.length > 0 ? (
                <tbody>
                  {data?.map((row: any, index) => (
                    <tr
                      onClick={
                        props.withNavigation && props.navigationProps
                          ? () =>
                              navigate(
                                `/${props.navigationProps?.baseRoute}/${
                                  row[props.navigationProps?.accessor!]
                                }`
                              )
                          : undefined
                      }
                      key={index}
                      className={`child:py-6 child:px-3 child:space-y-2 child:text-ellipsis child:text-[#49474D] child:overflow-hidden  border-b border-gray-100 cursor-default`}
                    >
                      {props?.withCheck && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={
                              selectedRows.findIndex((el) =>
                                isDeepEqual(el, row)
                              ) >= 0
                            }
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleRow(row)}
                          />
                        </td>
                      )}
                      <td className="py-4">{index + 1}</td>
                      {headers
                        .sort((a, b) => {
                          const headerKeys = headers.map(
                            (header) => header.name
                          );
                          return (
                            headerKeys.indexOf(a.name) -
                            headerKeys.indexOf(b.name)
                          );
                        })
                        .map((_, i) => {
                          const header = selectedColumns[i];
                          const secondary_data = header?.secondary_key
                            ? get_nested_value(row, header?.secondary_key)
                            : "";
                          const data = get_nested_value(row, header?.accessor);
                          return (
                            <React.Fragment key={i}>
                              {header && !header.hidden && (
                                <td
                                  key={i}
                                  className={`text-${
                                    header?.rowAlign
                                  }  min-w-[6rem] ${
                                    selectedColumns.findIndex(
                                      (el) => el.accessor === header?.accessor
                                    ) >= 0
                                      ? "visible"
                                      : "hidden"
                                  }`}
                                >
                                  {header?.row
                                    ? header.row(data, secondary_data, index)
                                    : data}
                                </td>
                              )}
                            </React.Fragment>
                          );
                        })}
                      {props.withActions && (
                        <td
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {props?.ActionComponent && (
                            <props.ActionComponent data={row} />
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className="bg-white flex justify-center ">
                  {" "}
                  <tr className="absolute gap-2 top-[50%] left-[45%] flex flex-col items-center w-40">
                    <p className=" text-[16px] font-semibold">
                      {t("Nothing to display")}
                    </p>{" "}
                  </tr>
                </tbody>
              )}
            </table>
          </div>

          <div className=" hidden">
            {" "}
            <Pagination
              pageSize={10}
              dataLength={props.total}
              pageCount={props.lastPage!}
              loadMore={props.loadMore}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataGrid;
