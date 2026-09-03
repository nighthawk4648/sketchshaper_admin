import { AiFillFileExcel } from "react-icons/ai";
import { BiPrinter } from "react-icons/bi";
import { BiPencil } from "react-icons/bi";
import React from "react";
import { Link } from "react-router-dom";

const ContentBox = ({
    title,
    buttonText,
    buttonLink,
    bulkText,
    bulkLink,
    printText,
    printLink,
    excelText,
    excelLink,
    children,
}) => {
    return (
        <div className="border-2 border-gray-300 p-3 rounded-[15px] bg-white">
            <div className="md:flex justify-between border-b border-gray-300 pb-3">
                <h4 className="text-[18px] mb-2">{title}</h4>
                <div className="flex">
                    {printText && (
                        <Link
                            to={printLink}
                            className="flex items-center bg-[#0069D9] text-white py-1 px-2 rounded-[5px]"
                        >
                            <BiPrinter className="me-1" />
                            <span>{printText}</span>
                        </Link>
                    )}
                    {bulkText && (
                        <Link
                            to={bulkLink}
                            className="flex items-center bg-[#17a2b8] text-white py-1 px-2 rounded-[5px] ms-2"
                        >
                            <BiPencil className="me-1" />
                            <span>{bulkText}</span>
                        </Link>
                    )}
                    {excelText && (
                        <Link
                            to={excelLink}
                            className="flex items-center bg-[#17a2b8] text-white py-1 px-2 rounded-[5px] ms-2"
                        >
                            <AiFillFileExcel className="me-1" />
                            <span>{excelText}</span>
                        </Link>
                    )}
                    {buttonText && (
                        <Link
                            to={buttonLink}
                            className="flex items-center bg-[#28a745] text-white py-1 px-3 rounded-[5px] ms-2"
                        >
                            <BiPencil />
                            <span>{buttonText}</span>
                        </Link>
                    )}
                </div>
            </div>
            <div className="flex justify-between mt-3">
                <div>
                    <span>Show</span>
                    <select name="" id="" class="ml-2 mr-2 text-sm">
                        <option value="">10</option>
                        <option value="">20</option>
                        <option value="">30</option>
                    </select>
                    <span>entries</span>
                </div>
                <div>
                    <span>Search: </span>
                    <input
                        type="text"
                        placeholder="Search"
                        className="h-[30px] w-[150px] ml-[10px] rounded-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">{children}</div>
            <div className="mt-4 md:flex justify-between">
                <p>Showing 1 to 4 of 4 entries</p>
                <div className="mt-2">
                    <span className="border border-gray-300 py-1 px-3 rounded-tl-lg rounded-bl-lg cursor-pointer">
                        Previous
                    </span>
                    <span className="bg-[#007BFF] border border-gray-300 py-1 px-3 text-white">
                        1
                    </span>
                    <span className="border border-gray-300 py-1 px-3 rounded-tr-lg rounded-br-lg cursor-pointer">
                        Next
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ContentBox;
