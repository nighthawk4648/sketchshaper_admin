import CustomPaginationTable from "@/components/shared/CustomTable/CustomPaginationTable";
import IntegerWisedStatusFullMeaningForAdmin from "@/components/shared/IntegerWisedStatusFullMeaning/IntegerWisedStatusFullMeaningForAdmin";
import SkeletionTable from "@/components/skeleton/Table";
import { useGetAllParcelListsByPaginationQuery, useGetAllParcelListsForBranchByPaginationQuery } from "@/store/api/app/Parcel/allParcelListApiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";


const RecentParcelsForAdmin = () => {

    const { isAuth, auth } = useSelector((state) => state.auth);


    const [paginationPage, setPaginationPage] = useState(1);
    const [limit, setLimit] = useState(7);
    const [order, setOrder] = useState('desc');
    const [search, setSearch] = useState('');


    const { data, isLoading, isFetching } = useGetAllParcelListsByPaginationQuery(
        {
            page: paginationPage,
            limit: limit,
            order: order,
            search: search,
        }
    );


    if (isLoading) return <SkeletionTable />;


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const COLUMNS = [




        {
            Header: "Invoice",
            Cell: (row) => {
                return (
                    <div>
                        <p>
                            {row?.cell?.row?.original?.parcel_invoice}
                        </p>
                    </div>
                );
            },
        },



        {
            Header: "Customer",
            Cell: (row) => {
                return (
                    <div>
                        <p>
                            {row?.cell?.row?.original?.customer_name}
                        </p>
                    </div>
                );
            },
        },


        {
            Header: "Number",
            Cell: (row) => {
                return (
                    <div>
                        <p>
                            {row?.cell?.row?.original?.customer_contact_number}
                        </p>
                    </div>
                );
            },
        },



        {
            Header: "Status",
            Cell: (row) => {
                return (
                    <div className="flex flex-col justify-center">
                        <div>
                            <IntegerWisedStatusFullMeaningForAdmin
                                status={row?.cell?.row?.original?.status}
                                delivery_type={row?.cell?.row?.original?.delivery_type}
                                payment_type={row?.cell?.row?.original?.payment_type}
                            />
                        </div>
                    </div>
                );
            },
        },





    ];

    return (
        <div className="lg:pb-4 pb-0">
            <CustomPaginationTable
                title="Recent Parcels"
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
                defaultStatus={false}
                addNew={false}
                defaultAction={false}
                defaultSL={false}
                isSearch={false}
                isPaginationShow={false}
            />
        </div>
    );
};

export default RecentParcelsForAdmin;
