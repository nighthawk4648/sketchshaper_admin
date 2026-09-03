import Loading from '@/components/Loading';
import Error from '@/pages/404';
import { useParams } from 'react-router-dom';
import AdminForm from './adminForm';
import { useGetAdminUserByIdQuery } from '@/store/api/app/setting/admin/adminApiSlice';

const AdminEdit = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetAdminUserByIdQuery(id);

	if (isLoading || isFetching) return <Loading />;

	if (!id) return <Error />;

	return (
		<>
			<AdminForm id={id} data={data?.data} />
		</>
	);
};

export default AdminEdit;
