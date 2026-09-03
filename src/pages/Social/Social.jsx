import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetSocialsByPaginationQuery } from '@/store/api/app/Social/socialApiSlice';
import { useGetSlidersByPaginationQuery } from '@/store/api/app/website/slider/sliderApiSlice';
import { useState } from 'react';

const Social = () => {
	const [paginationPage, setPaginationPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [order, setOrder] = useState('desc');
	const [search, setSearch] = useState('');
	const noImage = useNoImage()

	const { data, isLoading, isError, error, isFetching } =
    useGetSocialsByPaginationQuery({
			page: paginationPage,
			limit: limit,
			order: order,
			search: search,
		});

	if (isLoading) return <SkeletionTable />;
	// if (!data?.data?.result?.length) {
	// 	return <h1 className="text-2xl font-bold">No Data Found</h1>
	// }

	const COLUMNS = [
		{
			Header: 'Social Icon',
			accessor: 'icon',
			Cell: (row) => (
				<img
					src={`${envConfig.apiImgUrl}${row?.cell?.value}`}
					alt="slider"
					className="h-20 w-auto object-cover rounded-lg"
					onError={(e) => {
						e.target.onerror = null; // Prevents looping
						e.target.src = noImage;
					}}
				/>
			),
		},

		

		{
			Header: 'Name',
			accessor: 'name',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
		{
			Header: 'Url',
			accessor: 'url',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
	];

	return (
		<>
			<CustomPaginationTable
				title="Socials"
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
				isView={false}
				defaultStatus={false}
			/>
		</>
	);
};

export default Social;
