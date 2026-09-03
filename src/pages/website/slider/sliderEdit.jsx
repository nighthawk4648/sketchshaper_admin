import Loading from '@/components/Loading';
import Error from '@/pages/404';
import { useGetSliderByIdQuery } from '@/store/api/app/website/slider/sliderApiSlice';
import { useParams } from 'react-router-dom';
import SliderForm from './sliderForm';

const SliderEdit = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetSliderByIdQuery(id);

	if (isLoading || isFetching) return <Loading />;

	if (!id) return <Error />;

	return (
		<>
			<SliderForm id={id} data={data?.data} />
		</>
	);
};

export default SliderEdit;
