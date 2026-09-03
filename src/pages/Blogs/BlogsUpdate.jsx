import Loading from '@/components/Loading';
import { useGetBlogsByIdQuery } from '@/store/api/app/Blogs/BlogsApiSlice';
import React from 'react';
import { useParams } from 'react-router-dom';
import Error from '../404';
import BlogsForm from './BlogsForm';

const BlogsUpdate = () => {
    const { id } = useParams();

	const { data, isFetching, isLoading, isError, error } =
    useGetBlogsByIdQuery(id);

	if (isLoading || isFetching) return <Loading />;

	if (!id) return <Error />;


    return (
        <div>
            <BlogsForm id={id} data={data?.data} />
        </div>
    );
};

export default BlogsUpdate;