import React from 'react';
import Card from "@/components/ui/Card";

const PageView = ({ items, title }) => {
    const noImage = "/No_Image.jpeg"
    return (
        <div className="">

            <div className="md:w-[60%] mx-auto">
                <Card title={title}>
                    <ul className="space-y-3 mt-6 divide-y dark:divide-slate-700 divide-slate-100">
                        {items.map((item, i) => {
                            return (
                                <>
                                    {
                                        item.status ? (
                                            <li key={i} className="">
                                                <div className="py-3 flex justify-between items-center">
                                                    <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.status}</h3>

                                                    <div className="w-[60%] flex justify-start">
                                                        <span className="flex items-center space-x-3 rtl:space-x-reverse">
                                                            <span className={`h-[35px] w-[120px]  rounded-full flex justify-center items-center  ${(item?.value === 1 || item?.value === true ? "bg-success-500 text-white" : "bg-danger-500 text-white")}`}>

                                                                <span>{(item.value === 1 || item?.value === true ? "Active" : "Inactive")}</span>
                                                            </span>
                                                        </span>
                                                    </div>

                                                </div>
                                            </li>
                                        ) : item?.image ? (
                                            <li key={i} className="">
                                                <div className="py-3 flex justify-between items-center">
                                                    <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.image}</h3>
                                                    <div className='w-[60%] flex justify-start'>

                                                        <img src={import.meta.env.VITE_LOCAL_API_URL + item?.value}
                                                            onError={(e) => {
                                                                e.target.onerror = null; // Prevents looping
                                                                e.target.src = noImage;
                                                            }}
                                                            alt="" className='w-[150px] h-[90px]' />
                                                    </div>
                                                </div>
                                            </li>
                                        ) :
                                            item?.long_details ? (
                                                <li key={i} className="">
                                                    <div className="py-3 flex justify-between items-center">
                                                        <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.long_details}</h3>
                                                        <div className='w-[60%] flex justify-start'>

                                                            <div className='text-[13px]' dangerouslySetInnerHTML={{ __html: item?.value }} />
                                                        </div>
                                                    </div>
                                                </li>
                                            ) :
                                                item?.map ? (
                                                    <li key={i} className="">
                                                        <div className="py-3 flex justify-between items-center">
                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.map}</h3>
                                                            <div className='w-[60%] flex justify-start'>

                                                                <iframe
                                                                    src={item?.value}
                                                                    width="600"
                                                                    height="450"
                                                                    allowfullscreen=""
                                                                    loading="lazy"
                                                                    referrerpolicy="no-referrer-when-downgrade"
                                                                ></iframe>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )

                                                    : item?.branch_user_list ? <li key={i} className="">
                                                        <div className="py-3 flex justify-between">
                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.branch_user_list}</h3>
                                                            <div className='w-[60%]'>
                                                                <div>
                                                                    <li className="">
                                                                        <div className="py-3 flex justify-between items-center">
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[10%]">#</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Name</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Address</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Contact Number</h3>
                                                                        </div>
                                                                    </li>
                                                                    <br />
                                                                </div>

                                                                {
                                                                    item?.value?.map((user, index) => {
                                                                        return (
                                                                            <>
                                                                                <li key={index} className="">
                                                                                    <div className="py-3 flex justify-between items-center">
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[10%] flex justify-start">{index + 1}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.name}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.address}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.contact_number}</p>
                                                                                    </div>
                                                                                </li>
                                                                                <br />
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </li> : item?.merchant_list ? <li key={i} className="">
                                                        <div className="py-3 flex justify-between">
                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.merchant_list}</h3>
                                                            <div className='w-[60%]'>
                                                                <div>
                                                                    <li className="">
                                                                        <div className="py-3 flex justify-between items-center">
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[10%]">#</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Name</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Address</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Contact Number</h3>
                                                                        </div>
                                                                    </li>
                                                                    <br />
                                                                </div>

                                                                {
                                                                    item?.value?.map((user, index) => {
                                                                        return (
                                                                            <>
                                                                                <li key={index} className="">
                                                                                    <div className="py-3 flex justify-between items-center">
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[10%] flex justify-start">{index + 1}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.name}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.address}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.contact_number}</p>
                                                                                    </div>
                                                                                </li>
                                                                                <br />
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </li> : item?.rider_list ? <li key={i} className="">
                                                        <div className="py-3 flex justify-between">
                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.rider_list}</h3>
                                                            <div className='w-[60%]'>
                                                                <div>
                                                                    <li className="">
                                                                        <div className="py-3 flex justify-between items-center">
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[10%]">#</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Name</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Address</h3>
                                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[30%]">Contact Number</h3>
                                                                        </div>
                                                                    </li>
                                                                    <br />
                                                                </div>

                                                                {
                                                                    item?.value?.map((user, index) => {
                                                                        return (
                                                                            <>
                                                                                <li key={index} className="">
                                                                                    <div className="py-3 flex justify-between items-center">
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[10%] flex justify-start">{index + 1}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.name}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.address}</p>
                                                                                        <p className="text-xs dark:text-slate-400 text-slate-600 w-[30%] flex justify-start">{user.contact_number}</p>
                                                                                    </div>
                                                                                </li>
                                                                                <br />
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </li> : <li key={i} className="">
                                                        <div className="py-3 flex justify-between items-center w-full">
                                                            <h3 className="text-sm font-semibold dark:text-slate-50 text-slate-900 w-[40%]">{item.title}</h3>
                                                            <p className="text-xs dark:text-slate-400 text-slate-600 w-[60%] flex justify-start">{item.value}</p>
                                                        </div>
                                                    </li>
                                    }

                                </>

                            );

                        })}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default PageView;