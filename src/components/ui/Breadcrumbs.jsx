import Icon from '@/components/ui/Icon';
import navMenu from '@/constant/navMenu';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
	const { isAuth, auth } = useSelector((state) => state.auth);
	const location = useLocation();
	const locationName = location.pathname.replace('/', '');

	const [isHide, setIsHide] = useState(null);
	const [groupTitle, setGroupTitle] = useState('');

	useEffect(() => {
		const currentMenuItem = navMenu(auth?.user?.user_type).find(
			(item) => item.link === locationName
		);

		const currentChild = navMenu().find((item) =>
			item.child?.find((child) => child.childlink === locationName)
		);

		if (currentMenuItem) {
			setIsHide(currentMenuItem.isHide);
		} else if (currentChild) {
			setIsHide(currentChild?.isHide || false);
			setGroupTitle(currentChild?.title);
		}
	}, [location, locationName]);

	return (
		<>
			{!isHide ? (
				<div className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse">
					<ul className="breadcrumbs">
						<li className="text-primary-500">
							<NavLink to="/" className="text-lg">
								<Icon icon="heroicons-outline:home" />
							</NavLink>
							<span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
								<Icon icon="heroicons:chevron-right" />
							</span>
						</li>
						{groupTitle && (
							<li className="text-primary-500">
								<button type="button" className="capitalize">
									{groupTitle}
								</button>
								<span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
									<Icon icon="heroicons:chevron-right" />
								</span>
							</li>
						)}
						<li className="capitalize text-slate-500 dark:text-slate-400">
							{locationName}
						</li>
					</ul>
				</div>
			) : null}
		</>
	);
};

export default Breadcrumbs;
