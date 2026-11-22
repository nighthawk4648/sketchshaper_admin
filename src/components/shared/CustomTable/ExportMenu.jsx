import { Fragment } from "react";
import { Icon } from "@iconify/react";
import { Menu, Transition } from "@headlessui/react";
import Button from "@/components/ui/Button";

const OPTIONS = [
  { format: "xlsx", icon: "vscode-icons:file-type-excel", label: "Excel (.xlsx)" },
  { format: "csv", icon: "vscode-icons:file-type-csv", label: "CSV (.csv)" },
];

// The Download button with its Excel / CSV choice
const ExportMenu = ({ onExport, disabled = false }) => (
  <Menu as="div" className="relative inline-block text-left">
    <Menu.Button as="div" className={disabled ? "pointer-events-none opacity-60" : "cursor-pointer"}>
      <Button
        div={true}
        icon="heroicons-outline:arrow-down-tray"
        text="Download"
        className="btn-outline-dark dark:border-slate-700 h-min text-sm font-normal"
        iconClass="text-lg"
      />
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 mt-2 w-48 rounded bg-white dark:bg-slate-800 shadow-dropdown z-[9999] border border-slate-100 dark:border-slate-700 py-1 focus:outline-none">
        {OPTIONS.map((o) => (
          <Menu.Item key={o.format}>
            {({ active }) => (
              <button
                type="button"
                onClick={() => onExport && onExport(o.format)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 rtl:space-x-reverse ${
                  active
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Icon icon={o.icon} className="text-lg" />
                <span>{o.label}</span>
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  </Menu>
);

export default ExportMenu;
