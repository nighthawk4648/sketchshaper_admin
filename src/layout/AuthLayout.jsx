import Loading from '@/components/Loading';
import { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const AuthLayout = () => {
	const { isAuth, auth } = useSelector((state) => state.auth);

	console.log(isAuth, auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuth) {
			navigate('/login');
			dispatch({ type: 'LOGOUT' });
		}
	}, [isAuth, navigate]);

	return (
		<>
			<Suspense fallback={<Loading />}>
				<ToastContainer />
				{<Outlet />}
			</Suspense>
		</>
	);
};

export default AuthLayout;
