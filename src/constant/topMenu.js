const topMenu = [
	{
		title: 'Dashboard',
		icon: 'heroicons-outline:home',
		link: 'dashboard',
	},
	{
		title: 'Multi Level',
		icon: 'heroicons:share',
		link: '#',
		child: [
			{
				childtitle: 'Level 1.1',
				childlink: 'icons',
			},
			{
				childtitle: 'Level 1.2',
				childlink: 'Level-1',
				multi_menu: [
					{
						multiTitle: 'Level 2.1',
						multiLink: 'Level-2',
					},
					{
						multiTitle: 'Level 2.2',
						multiLink: 'Level-2.3',
					},
				],
			},
		],
	},
	{
		title: 'Multi Level',
		icon: 'heroicons:share',
		link: '#',
		megamenu: [
			{
				megamenutitle: 'Level 1',
				megamenuicon: 'heroicons-outline:user',
				singleMegamenu: [
					{
						m_childtitle: 'Level 1.1',
						m_childlink: '/#',
					},
					{
						m_childtitle: 'Level 1.2',
						m_childlink: '/#',
					},
				],
			},

			{
				megamenutitle: 'Level 2',
				megamenuicon: 'heroicons-outline:user',
				singleMegamenu: [
					{
						m_childtitle: 'Level 2.1',
						m_childlink: '/#',
					},
					{
						m_childtitle: 'Level 2.2',
						m_childlink: '/#',
					},
				],
			},
		],
	},
];

export default topMenu;
