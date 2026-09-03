import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
// this-week, last-week, prv-month, this-month, this-year, prv-year, 
const actions = [
  {
    name: " This Week ",
    value: "this-week",
  },
  {
    name: " Last Week ",
    value: "last-week",
  },
  {
    name: " Previous Month ",
    value: "prv-month",
  },
  {
    name: " This Month ",
    value: "this-month",
  },
  {
    name: " This Year ",
    value: "this-year",
  },
  {
    name: " Previous Year ",
    value: "prv-year",
  },
];
const SelectMonth = ({ setSelectChartFilter, setSelectChartFilterLabel }) => {
  return (
    <>
      <Dropdown
        classMenuItems=" w-[140px]"
        label={
          <span className="text-lg inline-flex h-6 w-6 flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded dark:text-slate-400">
            <Icon icon="heroicons-outline:dots-horizontal" />
          </span>
        }
      >
        <div>
          {actions.map((item, i) => (
            <Menu.Item key={i}>
              <div
                className="`
                
                  hover:bg-secondary-500 dark:hover:bg-slate-600 dark:bg-opacity-60 hover:text-white text-slate-900 dark:text-slate-300
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center `"
                onClick={() => { setSelectChartFilter(item.value); setSelectChartFilterLabel(item.name) }} >
                <span>{item.name}</span>
              </div>
            </Menu.Item>
          ))}
        </div>
      </Dropdown>
    </>
  );
};

export default SelectMonth;
