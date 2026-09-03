


import React from "react";

import Loading from '@/components/Loading';
import { useParams } from 'react-router-dom';
import PageView from "@/components/shared/PageView/PageView";
import { useGetSliderByIdQuery } from "@/store/api/app/website/slider/sliderApiSlice";

const SliderView = () => {
	const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
		useGetSliderByIdQuery(id);

	console.log("data", data);
	const items = [
		{
			status: "Status",
			value: data?.data?.status,
		},
		{
			image: "Image",
			value: data?.data?.image,

		},
		{
			title: "Title ",
			value: data?.data?.title,

		},
		{
			title: "Details",
			value: data?.data?.details,

		},
	];

	if (isLoading || isFetching) return <Loading />;
	return (
		<div>
			<PageView items={items} title="View Title" />
		</div>
	);
};

export default SliderView;
