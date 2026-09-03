import envConfig from '@/configs/envConfig';
import Cookies from 'js-cookie';

const API_BASE_URL = envConfig.apiUrl;

/**
 * Get admin token from cookies or localStorage
 */
const getAdminToken = () => {
	// Try to get from cookies first
	let token = Cookies.get('token');
	
	// If not in cookies, try localStorage
	if (!token) {
		const user = localStorage.getItem('user');
		if (user) {
			try {
				const parsedUser = JSON.parse(user);
				token = parsedUser?.auth?.token;
			} catch (e) {
				console.error('Error parsing user from localStorage:', e);
			}
		}
	}
	
	return token;
};

/**
 * Patreon API utility functions
 */

export const patreonApi = {
	/**
	 * Get all Patreon users with pagination
	 */
	getUsers: async (page = 1, limit = 10, order = 'desc', search = '') => {
		const token = getAdminToken();
		
		if (!token) {
			throw new Error('Admin token not found. Please login first.');
		}

		try {
			const response = await fetch(
				`${API_BASE_URL}/patreon/users?page=${page}&limit=${limit}&order=${order}&search=${search}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error fetching Patreon users:', error);
			throw error;
		}
	},

	/**
	 * Get single Patreon user by ID
	 */
	getUserById: async (id) => {
		const token = getAdminToken();
		
		if (!token) {
			throw new Error('Admin token not found. Please login first.');
		}

		try {
			const response = await fetch(`${API_BASE_URL}/patreon/users/${id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error fetching Patreon user:', error);
			throw error;
		}
	},

	/**
	 * Revoke Patreon user access
	 */
	revokeUser: async (id) => {
		const token = getAdminToken();
		
		if (!token) {
			throw new Error('Admin token not found. Please login first.');
		}

		try {
			const response = await fetch(`${API_BASE_URL}/patreon/users/${id}/revoke`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error revoking Patreon user:', error);
			throw error;
		}
	},

	/**
	 * Get Patreon statistics
	 */
	getStats: async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/patreon/users?limit=1000`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const users = data?.data?.result || [];

			return {
				totalUsers: users.length,
				activePatrons: users.filter((u) => u.is_active_patron).length,
				inactivePatrons: users.filter((u) => !u.is_active_patron).length,
				totalRevenue: users.reduce((sum, u) => sum + (u.pledge_amount_cents || 0), 0),
				averagePledge:
					users.length > 0
						? users.reduce((sum, u) => sum + (u.pledge_amount_cents || 0), 0) / users.length
						: 0,
				tierBreakdown: {
					basic: users.filter((u) => u.membership_tier === 'basic').length,
					standard: users.filter((u) => u.membership_tier === 'standard').length,
					premium: users.filter((u) => u.membership_tier === 'premium').length,
				},
			};
		} catch (error) {
			console.error('Error fetching Patreon stats:', error);
			throw error;
		}
	},
};
