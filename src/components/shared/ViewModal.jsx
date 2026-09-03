import React from "react";
// import './Modal.css'; // Import the CSS file containing styles
import { MdOutlineClose } from "react-icons/md";

function ViewModal({ children, modalRef, onClose, setOpenView, title }) {
    const handleModalClose = () => {
        setOpenView(false);
        onClose();
    };
    return (
        <section className=" ">
            <dialog
                ref={modalRef}
                className="h-fit w-full md:w-[50%] md:p-5 px-2 py-3 bg-white rounded-md focus:outline-none "
            >
                <div className="flex flex-col mb-3 w-full h-auto">
                    <div className="flex w-full h-auto justify-between items-center mb-5">
                        <h1 className="text-base font-semibold">{title || "View Modal"}</h1>
                        <div
                            onClick={handleModalClose}
                            className="flex w-1/12 h-auto justify-center cursor-pointer"
                        >
                            <MdOutlineClose className="text-xl" />
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className=" w-full h-auto  md:px-5 px-1  rounded">
                        {children}
                    </div>
                    {/* End of Modal Content */}
                </div>
            </dialog>
        </section>
    );
}

export default ViewModal;
