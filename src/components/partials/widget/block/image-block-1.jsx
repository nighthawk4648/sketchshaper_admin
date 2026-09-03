import React from "react";
import getGreeting from "@/utils/getGreeting";

import image1 from "@/assets/images/all-img/widget-bg-1.png";
const ImageBlock1 = ({ branchUser, adminUser }) => {
  return (
    <div
      className="bg-no-repeat bg-cover bg-center p-4 rounded-[6px] relative"
      style={{
        backgroundImage: `url(${image1})`,
      }}
    >
      <div className="max-w-[169px]">
        <div className="text-base font-medium text-slate-900 mb-2">
          {
            branchUser ? (
              getGreeting() + " " + branchUser?.data?.branche?.name
            ) : (
              getGreeting() + " " + adminUser?.data?.name
            )
          }
        </div>
        <p className="text-sm text-slate-800">
          {
            branchUser ? (
              branchUser?.data?.name
            ) : (
              adminUser?.data?.email
            )
          }
        </p>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 ltr:right-6 rtl:left-6 mt-2 h-12 w-12 bg-white text-slate-900 rounded-full text-xs font-medium flex flex-col items-center justify-center">
        {
          branchUser ? (
            <span>Branch</span>
          ) : (
            <span>Admin</span>
          )
        }
      </div>
    </div>
  );
};

export default ImageBlock1;
