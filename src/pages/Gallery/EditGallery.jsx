import GalleryForm from '@/components/Gallery/GalleryForm';
import Loading from '@/components/Loading';
import { useGetGalleryByIdQuery } from '@/store/api/app/Gallery/galleryApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';

const EditGallery = () => {
	const { id } = useParams();
	console.log("id", id);

	const { data, isLoading } = useGetGalleryByIdQuery(id);

	if (isLoading) {
		return <Loading />;
	}

	console.log("data", data);
	return (
		<div>
			<GalleryForm id={id} data={data?.data} />
		</div>
	);
};

export default EditGallery;
