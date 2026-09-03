import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetAdminUsersByPaginationQuery } from '@/store/api/app/setting/admin/adminApiSlice';
import { useState } from 'react';

const Admin = () => {
	const [paginationPage, setPaginationPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [order, setOrder] = useState('desc');
	const [search, setSearch] = useState('');
	const noImage = useNoImage()

	const { data, isLoading, isError, error, isFetching } =
		useGetAdminUsersByPaginationQuery({
			page: paginationPage,
			limit: limit,
			order: order,
			search: search,
		});

	if (isLoading || isFetching) return <SkeletionTable />;

	const COLUMNS = [
		{
			Header: "Name",
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
					alt="admin"
					className="h-20 w-auto object-cover rounded-lg"
					onError={(e) => {
                        e.target.onerror = null; // Prevents looping
                        e.target.src = noImage;
                    }}
				/>
			),
		},
		{
			Header: "Phone",
			accessor: "contact_number",
			Cell: (row) => {
				return <span>{row?.cell?.value}</span>;
			},
		},
		{
			Header: "Email",
			accessor: "email",
			Cell: (row) => {
				return <span>{row?.cell?.value}</span>;
			},
		},
		{
			Header: 'Type',
			accessor: 'type',
			Cell: (row) => {
				const pageType = row?.cell?.value;
				let pageTypeText = '';

				if (pageType === 1) {
					pageTypeText = 'Admin';
				} else if (pageType === 2) {
					pageTypeText = 'Operation';
				} else if (pageType === 3) {
					pageTypeText = 'Account';
				} else if (pageType === 4) {
					pageTypeText = 'CS';
				}
				else if (pageType === 5) {
					pageTypeText = 'Business Development';
				}
				else if (pageType === 6) {
					pageTypeText = 'General User';
				}

				return <span>{pageTypeText}</span>;
			},
		},
	];

	return (
		<>
			<CustomPaginationTable
				title="Admins"
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

export default Admin;
