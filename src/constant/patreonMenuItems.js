/**
 * Patreon Menu Items Configuration
 * Add these items to your sidebar navigation
 */

export const patreonMenuItems = [
	{
		title: 'Patreon',
		icon: 'heroicons:heart',
		href: '/admin/patreon',
		badge: 'NEW',
		children: [
			{
				title: 'Dashboard',
				icon: 'heroicons:chart-bar-square',
				href: '/admin/patreon',
			},
			{
				title: 'Users',
				icon: 'heroicons:users',
				href: '/admin/patreon/users',
			},
		],
	},
];

/**
 * How to use:
 * 
 * 1. Import in your sidebar component:
 *    import { patreonMenuItems } from '@/constant/patreonMenuItems';
 * 
 * 2. Add to your menu items array:
 *    const menuItems = [...otherItems, ...patreonMenuItems];
 * 
 * 3. Render in your sidebar:
 *    {menuItems.map(item => <MenuItem key={item.title} {...item} />)}
 */
