import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Flatpickr from "react-flatpickr";

const FlatpickerPage = ({ fromDate, setFromDate, fromDateShow, toDateShow, toDate, setToDate }) => {

    return (
        <div>
            <div title="">
                <div className="grid  grid-cols-1 gap-5">
                    <div>
                        {/* <label htmlFor="default-picker" className=" form-label">
                            Default Functionality
                        </label> */}

                        {
                            fromDateShow && <Flatpickr
                                className="form-control py-2" style={{ background: 'transparent' }}
                                value={fromDate || "yyyy-mm-dd"}
                                defaultValue="yyyy-mm-dd"
                                onChange={(date) => setFromDate(date)}
                                placeholder="yyyy-mm-dd"
                                id="default-picker"
                            />
                        }
                        {
                            toDateShow && <Flatpickr
                                className="form-control py-2" style={{ background: 'transparent' }}
                                value={toDate || "yyyy-mm-dd"}
                                onChange={(date) => setToDate(date)}
                                placeholder="yyyy-mm-dd"
                                id="default-picker"
                            />
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlatpickerPage;
