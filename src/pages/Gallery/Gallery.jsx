import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetGalleriesByPaginationQuery } from '@/store/api/app/Gallery/galleryApiSlice';
import { useState } from 'react';

const Gallery = () => {
	const [paginationPage, setPaginationPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [order, setOrder] = useState('desc');
	const [search, setSearch] = useState('');
	const noImage = useNoImage();

	const { data, isLoading, isError, error, isFetching } =
		useGetGalleriesByPaginationQuery({
			page: paginationPage,
			limit: limit,
			order: order,
			search: search,
		});

	if (isLoading) return <SkeletionTable />;

	const COLUMNS = [
		{
			Header: 'Gallery Image',
			accessor: 'image',
			Cell: (row) => (
				<img
					src={`${envConfig.apiImgUrl}${row?.cell?.value}`}
					alt="gallery"
					className="h-20 w-auto object-cover rounded-lg"
					onError={(e) => {
						e.target.onerror = null; // Prevents looping
						e.target.src = noImage;
					}}
				/>
			),
		},
	];

	return (
		<>
			<CustomPaginationTable
				title="Gallery"
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
			/>
		</>
	);
};

export default Gallery;
