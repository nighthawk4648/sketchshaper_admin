import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetSocialLinksByPaginationQuery } from '@/store/api/app/website/socialLink/socialLinkApiSlice';
import { useState } from 'react';

const SocialLink = () => {
	const [paginationPage, setPaginationPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [order, setOrder] = useState('desc');
	const [search, setSearch] = useState('');
	const noImage = useNoImage()

	const { data, isLoading, isError, error, isFetching } =
		useGetSocialLinksByPaginationQuery({
			page: paginationPage,
			limit: limit,
			order: order,
			search: search,
		});

	if (isLoading ) return <SkeletionTable />;

	const COLUMNS = [
		{
			Header: 'name',
			accessor: 'name',
			Cell: (row) => {
				return <span>{row?.cell?.value}</span>;
			},
		},
		{
			Header: 'Url',
			accessor: 'url',
			Cell: (row) => {
				return <span>{row?.cell?.value}</span>;
			},
		},
		{
			Header: 'Icon',
			accessor: 'icon',
			Cell: (row) => (
				<img
					src={`${envConfig.apiImgUrl}${row?.cell?.value}`}
					alt="icon"
					className="h-20 w-auto object-cover rounded-lg"
					onError={(e) => {
                        e.target.onerror = null; // Prevents looping
                        e.target.src = noImage;
                    }}
				/>
			),
		},
		{
			Header: 'Details',
			accessor: 'details',
			Cell: (row) => {
				return <span>{row?.cell?.value}</span>;
			},
		},
	];

	return (
		<>
			<CustomPaginationTable
				title="Social Links"
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

export default SocialLink;
