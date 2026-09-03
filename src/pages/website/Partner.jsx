import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import { useGetPartnersByPaginationQuery } from '@/store/api/app/website/partner/partnerApiSlice';
import { useState } from 'react';
import Loading from '@/components/Loading';
import CustomTable from '@/components/shared/CustomTable/CustomTable';
import Icon from "@/components/ui/Icon";
import Tooltip from '@/components/ui/Tooltip';
import { useGetPartnersQuery } from '@/store/api/app/website/partner/partnerApiSlice';
import useNoImage from '@/hooks/useNoImage';

const Partner = () => {
    const [paginationPage, setPaginationPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [order, setOrder] = useState('desc');
    const [search, setSearch] = useState('');
    const noImage = useNoImage()

    const { data, isLoading, isError, error, isFetching } =
        useGetPartnersByPaginationQuery({
            page: paginationPage,
            limit: limit,
            order: order,
            search: search,
        });

    if (isLoading) return <SkeletionTable />;

    const COLUMNS = [
        {
            Header: "name",
            accessor: "name",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
        {
            Header: 'Image',
            accessor: 'image',
            Cell: (row) => (
                <img
                    src={`${envConfig.apiImgUrl}${row?.cell?.value}`}
                    alt="partner"
                    className="h-20 w-auto object-cover rounded-lg"
                    onError={(e) => {
                        e.target.onerror = null; // Prevents looping
                        e.target.src = noImage;
                    }}
                />
            ),
        },
        {
            Header: "Url",
            accessor: "url",
            Cell: (row) => {
                return <span>{row?.cell?.value}</span>;
            },
        },
    ];

    return (
        <>
            <CustomPaginationTable
                title="Partners"
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
        </>
    );
};

export default Partner;
