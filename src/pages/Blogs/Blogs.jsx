import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetBlogsByPaginationQuery } from '@/store/api/app/Blogs/BlogsApiSlice';
import { useGetSlidersByPaginationQuery } from '@/store/api/app/website/slider/sliderApiSlice';
import { useState } from 'react';

const Blogs = () => {
	const [paginationPage, setPaginationPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [order, setOrder] = useState('desc');
	const [search, setSearch] = useState('');
	const noImage = useNoImage()

	const { data, isLoading, isError, error, isFetching } =
    useGetBlogsByPaginationQuery({
			page: paginationPage,
			limit: limit,
			order: order,
			search: search,
		});

	if (isLoading) return <SkeletionTable />;
	

	const COLUMNS = [
		{
			Header: 'Image',
			accessor: 'image',
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
			Header: 'BG Image',
			accessor: 'bgImage',
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
			accessor: 'title',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
        {
			Header: 'Name',
			accessor: 'name',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
		{
			Header: 'Short Description',
			accessor: 'short_description',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
		{
			Header: 'Back Link',
			accessor: 'back_link',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
	];

	return (
		<>
			<CustomPaginationTable
				title="Blogs"
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

export default Blogs;
