import Loading from '@/components/Loading';
import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import CustomTable from '@/components/shared/CustomTable/CustomTable';
import SkeletionTable from '@/components/skeleton/Table';
import Icon from "@/components/ui/Icon";
import Tooltip from '@/components/ui/Tooltip';
import { useGetNoticesByPaginationQuery } from '@/store/api/app/Notice/noticeApiSlice';
import { useGetBranchesByPaginationQuery } from '@/store/api/app/Team/branch/branchApiSlice';

import React, { useState } from 'react';

const Notice = () => {

    const [paginationPage, setPaginationPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [order, setOrder] = useState('desc');
    const [search, setSearch] = useState('');

    const { data, isLoading, isFetching } = useGetNoticesByPaginationQuery({
        page: paginationPage,
        limit: limit,
        order: order,
        search: search,
    });

    if (isLoading) return <SkeletionTable />

    const COLUMNS = [

        {
            Header: "Title",
            accessor: "title",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },

        {
            Header: "Type",
            accessor: "type",
            // Cell: (row) => {
            //     return <span>{row?.cell?.value}</span>;
            // },
            Cell: (row) => {
                return (
                    <span className="block w-full">
                        <span
                        >
                            {row?.cell?.value === 1 ? "Notice" : row?.cell?.value === 2 ? "News" : ""}
                        </span>
                    </span>
                );
            },
        },
        {
            Header: "Notice Or News For",
            accessor: "publish_for",
            Cell: (row) => {
                return (
                    <span className="block w-full">
                        <span
                        >
                            {row?.cell?.value === 0 ? "All" : row?.cell?.value === 1 ? "Branch" : row?.cell?.value === 2 ? "Merchant" : ""}
                        </span>
                    </span>
                );
            },
        },
        {
            Header: "Date",
            accessor: "date_time",
            Cell: (row) => {
                return <span>{new Date(row?.cell?.value).toDateString()}</span>;
            },
        },

    ];


    return (
        <div>
            <CustomPaginationTable
                title='Branches List'
                COLUMNS={COLUMNS}
                data={data?.data}
                paginationPage={paginationPage}
                setPaginationPage={setPaginationPage}
                limit={limit}
                setLimit={setLimit}
                order={order}
                setOrder={setOrder}
                search={search}
                setSearch={setSearch}
            />

        </div>
    );
};

export default Notice;