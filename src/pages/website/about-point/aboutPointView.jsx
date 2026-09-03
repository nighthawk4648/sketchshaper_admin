import Loading from '@/components/Loading';
import PageView from '@/components/shared/PageView/PageView';
import { useGetAboutPointByIdQuery } from '@/store/api/app/website/aboutPoint/aboutPointApiSlice';
import { useParams } from 'react-router-dom';

const AboutPointView = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetAboutPointByIdQuery(id);

	const items = [
		{
			status: "Status",
			value: data?.data?.status,
		},
		{
			title: "Title ",
			value: data?.data?.title,

		},
		{
			title: "Details",
			value: data?.data?.details,

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
				<PageView items={items} title="View Objective" />
			</div>
		</>
	);
};

export default AboutPointView;
