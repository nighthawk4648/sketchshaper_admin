

import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetInnovativeByPaginationQuery } from '@/store/api/app/Innovative/InnovativeAPiSlice';
import { useGetSlidersByPaginationQuery } from '@/store/api/app/website/slider/sliderApiSlice';
import { useState } from 'react';

const Innovative = () => {
	const [paginationPage, setPaginationPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [order, setOrder] = useState('desc');
	const [search, setSearch] = useState('');
	const noImage = useNoImage()

	const { data, isLoading, isError, error, isFetching } =
    useGetInnovativeByPaginationQuery({
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
			Header: 'BG Image',
			accessor: 'bgImg',
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
			Header: 'Title',
			accessor: 'name',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
		{
			Header: 'Short Description',
			accessor: 'short_description',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},

        {
			Header: 'Url One',
			accessor: 'urlOne',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},

        {
			Header: 'url Two',
			accessor: 'urlTwo',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},

        {
			Header: 'Url Three',
			accessor: 'urlThree',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},

        {
			Header: 'Url Four',
			accessor: 'urlFour',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
	];

	return (
		<>
			<CustomPaginationTable
				title="Innovatives"
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

export default Innovative;
