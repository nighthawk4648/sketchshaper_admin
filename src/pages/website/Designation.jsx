import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import { useGetDesignationsByPaginationQuery } from '@/store/api/app/website/designation/designationApiSlice';
import { useState } from 'react';

const Designation = () => {
	const [paginationPage, setPaginationPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [order, setOrder] = useState('desc');
	const [search, setSearch] = useState('');

	const { data, isLoading, isError, error, isFetching } =
		useGetDesignationsByPaginationQuery({
			page: paginationPage,
			limit: limit,
			order: order,
			search: search,
		});
		// console.log("Designation:::",data?.data);
	if (isLoading || isFetching) return <SkeletionTable />;

	const COLUMNS = [
		{
			Header: "Name",
			accessor: "name",
			Cell: (row) => {
				return <span>{row?.cell?.value}</span>;
			},
		},

	];

	return (
		<>
			<CustomPaginationTable
				title="Designations"
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

export default Designation;
