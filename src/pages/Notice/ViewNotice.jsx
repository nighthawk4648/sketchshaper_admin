


import React from "react";

import Loading from '@/components/Loading';
import { useParams } from 'react-router-dom';
import PageView from "@/components/shared/PageView/PageView";
import { useGetNoticeByIdQuery } from "@/store/api/app/Notice/noticeApiSlice";

const ViewNotice = () => {
    const { id } = useParams();

    const { data, isFetching, isLoading, isError, error } =
        useGetNoticeByIdQuery(id);

    console.log("data", data);
    const items = [
        {
            status: "Status",
            value: data?.data?.status,
        },
        {
            title: "Title ",
            value: data?.data?.title,

        },
        {
            title: "Type",
            value: data?.data?.type === 0 ? "All" : data?.data?.type === 1 ? "Notice" : "News"
        },
        {
            title: "Publish For",
            value: data?.data?.publish_for,

        },

        {
            title: "Details ",
            value: data?.data?.short_details,

        },
        {
            title: "Date",
            value: new Date(data?.data?.date_time).toDateString(),

        }
    ];

    if (isLoading || isFetching) return <Loading />;
    return (
        <div>
            <PageView items={items} title="View Notice Or News" />
        </div>
    );
};

export default ViewNotice;
