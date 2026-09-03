import Loading from '@/components/Loading';
import PageView from '@/components/shared/PageView/PageView';
import { useParams } from 'react-router-dom';

const AdminView = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetPageContentByIdQuery(id);

	const items = [
		{
			status: "Status",
			value: data?.data?.status,
		},
		{
			title: "Type",
			value: data?.data?.type,

		},
		{
			title: "Name ",
			value: data?.data?.name,

		},
		{
			title: "Contact Number",
			value: data?.data?.contact_number,

		},
		{
			long_details: "Email",
			value: data?.data?.email,

		},
		{
			image: "Image",
			value: data?.data?.image,

		}
	];

	if (isLoading || isFetching) return <Loading />;

	return (
		<>
			<div>
				<PageView items={items} title="View Admin" />
			</div>
		</>
	);
};

export default AdminView;
