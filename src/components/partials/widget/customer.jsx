import React from "react";
import ProgressBar from "@/components/ui/ProgressBar";

import Image1 from "@/assets/images/all-img/cus-1.png";
import Image2 from "@/assets/images/all-img/cus-2.png";
import Image3 from "@/assets/images/all-img/cus-3.png";

import Cuser1 from "@/assets/images/users/user-1.jpg";
import Cuser2 from "@/assets/images/users/user-2.jpg";
import Cuser3 from "@/assets/images/users/user-3.jpg";
import customerCrownImage from "@/assets/images/icon/crown.svg";
import { useGetTopMerchantsForAdminQuery } from "@/store/api/app/Team/Merchant/merchantApiSLice";
import envConfig from '@/configs/envConfig';
import merchantPic from '../../../../src/assets/images/avatar/user.png';
import useNoImage from "@/hooks/useNoImage";


const Customer = () => {
  const noImage = useNoImage()

  const { data } = useGetTopMerchantsForAdminQuery();

  const merchantsData = data ? data?.data?.slice(0, 6) : [];
  // const lastThreeData = merchantsData ? merchantsData?.slice(-3) : [];
  // const firstThreeData = merchantsData ? merchantsData.slice(0, 3) : [];

  const colors = ["#E6FDFE", "#FEF4F0", "#EDF9F4"];



  return (
    <div className="pb-2">
      {/* <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        {lastThreeData?.map((item, i) => (
          <div
            key={i}
            className={`relative z-[1] text-center p-4 rounded before:w-full before:h-[calc(100%-60px)] before:absolute before:left-0 before:top-[60px] before:rounded before:z-[-1] before:bg-opacity-[0.1]`}
            style={{ backgroundColor: colors[i] || "" }}

          >
            <div
              className={`${item.active ? "ring-2 ring-[#FFC155]" : ""
                } h-[70px] w-[70px] rounded-full mx-auto mb-4 relative`}
            >
              {item.active && (
                <span className="crown absolute -top-[24px] left-1/2 -translate-x-1/2">

                </span>
              )}

              {item?.merchant?.image ? <img
                src={`${envConfig.apiUrl}${data?.data?.merchant?.image}`}
                alt=""
                className=""
              /> : <img
                src={merchantPic}
                alt=""
                className="" />}


              <span className="h-[27px] w-[27px] absolute right-0 bottom-0 rounded-full bg-[#FFC155] border border-white flex flex-col items-center justify-center text-white text-xs font-medium">
                {i}
              </span>

            </div>
            <h4 className="text-sm text-slate-600 font-semibold mb-4">
              {item.merchant?.name}
            </h4>
            <div className="inline-block bg-slate-900 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
              {item.parcel_count}
            </div>
            <div>
              <div className="flex justify-between text-sm font-normal dark:text-slate-300 mb-3 mt-4">
                <span>Percels</span>
                <span className="font-normal">{item.parcel_count}</span>
              </div>
              <ProgressBar value={item.parcel_count} style={{ backgroundColor: colors[i] || "" }} />
            </div>
          </div>
        ))}
      </div> */}


      <div className="grid grid-cols-1 gap-5 mt-5">
        {merchantsData.map((item, i) => (
          <div
            key={i}
            className="relative z-[1] p-4 rounded md:flex items-center bg-gray-5003 dark:bg-slate-900 md:space-x-10 md:space-y-0 space-y-3 rtl:space-x-reverse"
          >
            <div
              className={`${item.active ? "ring-2 ring-[#FFC155]" : ""
                } h-10 w-10 rounded-full relative`}
            >
              {/* {item.active && (
                <span className="crown absolute -top-[14px] left-1/2 -translate-x-1/2">
                  <img src={customerCrownImage} alt="" />
                </span>
              )} */}


              {/* <img
                src={item.img}
                alt=""
                className=""
              /> */}

              {item?.merchant?.image ? <img
                src={`${envConfig.apiUrl}${data?.data?.merchant?.image}`}
                alt=""
                className="w-full h-full rounded-full"
                onError={(e) => {
                  e.target.onerror = null; // Prevents looping
                  e.target.src = noImage;
                }}
              /> : <img
                src={merchantPic}
                alt=""
                className="w-full h-full rounded-full"
                onError={(e) => {
                  e.target.onerror = null; // Prevents looping
                  e.target.src = noImage;
                }} />}


              <span className="h-4 w-4 absolute right-0 bottom-0 rounded-full bg-[#FFC155] border border-white flex flex-col items-center justify-center text-white text-[10px] font-medium">
                {i + 1}
              </span>
            </div>
            <h4 className="text-sm text-slate-600 font-semibold w-[25%]">
              {item?.merchant?.name}
            </h4>
            <div className="inline-block text-center bg-slate-900 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
              {item.parcel_count}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm font-normal dark:text-slate-300 mb-3">
                <span>Parcels</span>
                <span className="font-normal">{item.parcel_count}</span>
              </div>
              <ProgressBar value={item.parcel_count} style={{ backgroundColor: colors[i] || "" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customer;
