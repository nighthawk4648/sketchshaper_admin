



import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Status = ({ id, status }) => {
	const { pathname } = useLocation();
	const pathArray = pathname.split('/');

	let hook = null;

	// if (pathArray.includes('slider')) {
	// 	hook = useUpdateSliderStatusMutation;
	// } 
	// else if (pathArray.includes('designation')) {
	// 	hook = useUpdateDesignationStatusMutation;
	// } 
	


	const [updateStatus, { isLoading, isError, error, isSuccess }] = hook
		? hook()
		: [
			() => { },
			{
				isLoading: false,
				isError: false,
				error: null,
				isSuccess: false,
			},
		];

	const handleToggleStatus = async () => {
		try {
			const newStatus = status ? 0 : 1;

			await updateStatus({
				id,
				status: newStatus,
			});

			toast.success('Status updated successfully');
		} catch (error) {
			console.log(error);
			toast.error('Failed to update status');
		}
	};

	return (
		<span className="block w-full">
			<span
				onClick={handleToggleStatus}
				className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 cursor-pointer ${status
					? 'text-success-500 bg-success-500'
					: 'text-danger-500 bg-danger-500'
					} 
       `}
			>
				{status ? 'Active' : 'Inactive'}
			</span>
		</span>
	);
};

export default Status;
