/**
 * PatreonExample.jsx
 * 
 * This file demonstrates different ways to use the Patreon integration
 * in your admin dashboard. You can use this as a reference for your own components.
 * 
 * This file is NOT part of the main integration - it's just for reference.
 */

import { usePatreon } from '@/hooks/usePatreon';
import { patreonApi } from '@/utils/patreonApi';
import {
	useGetPatreonUsersQuery,
	useRevokePatreonUserMutation,
} from '@/store/api/app/Patreon/patreonApiSlice';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';

/**
 * Example 1: Using the Custom Hook
 * This is the simplest and recommended approach
 */
export const PatreonHookExample = () => {
	const { users, stats, isLoading, handleRevoke, searchUsers } = usePatreon();

	if (isLoading) return <div>Loading...</div>;

	return (
		<Card>
			<h2 className="text-xl font-bold mb-4">Using usePatreon Hook</h2>

			<div className="space-y-4">
				<div>
					<p className="text-sm text-slate-600">Total Users: {stats?.totalUsers}</p>
					<p className="text-sm text-slate-600">
						Revenue: ${(stats?.totalRevenue / 100).toFixed(2)}
					</p>
				</div>

				<input
					type="text"
					placeholder="Search users..."
					onChange={(e) => searchUsers(e.target.value)}
					className="w-full px-3 py-2 border rounded"
				/>

				<div className="space-y-2">
					{users.map((user) => (
						<div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
							<span>{user.full_name}</span>
							<Button
								text="Revoke"
								onClick={() => handleRevoke(user.id)}
								className="btn-danger btn-sm"
							/>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
};

/**
 * Example 2: Using Redux Query Hook
 * For more control over caching and updates
 */
export const PatreonReduxExample = () => {
	const { data, isLoading } = useGetPatreonUsersQuery({
		page: 1,
		limit: 10,
		order: 'desc',
	});

	const [revokeUser] = useRevokePatreonUserMutation();

	if (isLoading) return <div>Loading...</div>;

	return (
		<Card>
			<h2 className="text-xl font-bold mb-4">Using Redux Query</h2>

			<div className="space-y-2">
				{data?.data?.result?.map((user) => (
					<div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
						<div>
							<p className="font-medium">{user.full_name}</p>
							<p className="text-sm text-slate-500">{user.email}</p>
						</div>
						<Button
							text="Revoke"
							onClick={() => revokeUser(user.id)}
							className="btn-danger btn-sm"
						/>
					</div>
				))}
			</div>
		</Card>
	);
};

/**
 * Example 3: Using Direct API Utilities
 * For simple, one-off API calls
 */
export const PatreonApiExample = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await patreonApi.getUsers(1, 10);
			setUsers(response.data.result);
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRevoke = async (userId) => {
		try {
			await patreonApi.revokeUser(userId);
			// Refresh users list
			fetchUsers();
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<Card>
			<h2 className="text-xl font-bold mb-4">Using Direct API</h2>

			<div className="space-y-4">
				<Button text="Fetch Users" onClick={fetchUsers} className="btn-primary" />

				{loading && <div>Loading...</div>}

				<div className="space-y-2">
					{users.map((user) => (
						<div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
							<span>{user.full_name}</span>
							<Button
								text="Revoke"
								onClick={() => handleRevoke(user.id)}
								className="btn-danger btn-sm"
							/>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
};

/**
 * Example 4: Statistics Display
 * Show Patreon statistics in a dashboard
 */
export const PatreonStatsExample = () => {
	const { stats, isLoading } = usePatreon();

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Card>
				<p className="text-sm text-slate-600">Total Users</p>
				<p className="text-2xl font-bold">{stats?.totalUsers}</p>
			</Card>

			<Card>
				<p className="text-sm text-slate-600">Active Patrons</p>
				<p className="text-2xl font-bold text-green-600">{stats?.activePatrons}</p>
			</Card>

			<Card>
				<p className="text-sm text-slate-600">Total Revenue</p>
				<p className="text-2xl font-bold text-blue-600">
					${(stats?.totalRevenue / 100).toFixed(2)}
				</p>
			</Card>

			<Card>
				<p className="text-sm text-slate-600">Avg Pledge</p>
				<p className="text-2xl font-bold text-purple-600">
					${(stats?.averagePledge / 100).toFixed(2)}
				</p>
			</Card>
		</div>
	);
};

/**
 * Example 5: Tier Breakdown
 * Show users by membership tier
 */
export const PatreonTierExample = () => {
	const { stats, isLoading } = usePatreon();

	if (isLoading) return <div>Loading...</div>;

	return (
		<Card>
			<h2 className="text-xl font-bold mb-4">Membership Tiers</h2>

			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<span>Basic</span>
					<span className="font-bold">{stats?.tierBreakdown?.basic}</span>
				</div>
				<div className="flex justify-between items-center">
					<span>Standard</span>
					<span className="font-bold">{stats?.tierBreakdown?.standard}</span>
				</div>
				<div className="flex justify-between items-center">
					<span>Premium</span>
					<span className="font-bold">{stats?.tierBreakdown?.premium}</span>
				</div>
			</div>
		</Card>
	);
};

/**
 * Example 6: Filter Users by Status
 * Show active vs inactive patrons
 */
export const PatreonFilterExample = () => {
	const { users, isLoading } = usePatreon();
	const [filterActive, setFilterActive] = useState(true);

	if (isLoading) return <div>Loading...</div>;

	const filtered = users.filter((u) => u.is_active_patron === filterActive);

	return (
		<Card>
			<h2 className="text-xl font-bold mb-4">Filter Users</h2>

			<div className="space-y-4">
				<div className="flex gap-2">
					<Button
						text="Active"
						onClick={() => setFilterActive(true)}
						className={filterActive ? 'btn-primary' : 'btn-secondary'}
					/>
					<Button
						text="Inactive"
						onClick={() => setFilterActive(false)}
						className={!filterActive ? 'btn-primary' : 'btn-secondary'}
					/>
				</div>

				<div className="space-y-2">
					{filtered.map((user) => (
						<div key={user.id} className="p-2 bg-gray-50 rounded">
							<p className="font-medium">{user.full_name}</p>
							<p className="text-sm text-slate-500">{user.email}</p>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
};

/**
 * Main Example Component
 * Shows all examples together
 */
export default function PatreonExamples() {
	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Patreon Integration Examples</h1>

			<PatreonStatsExample />
			<PatreonTierExample />
			<PatreonHookExample />
			<PatreonReduxExample />
			<PatreonApiExample />
			<PatreonFilterExample />
		</div>
	);
}

/**
 * Usage Notes:
 * 
 * 1. Choose ONE approach for your use case:
 *    - usePatreon hook: Simplest, recommended
 *    - Redux Query: More control, better caching
 *    - Direct API: Simple one-off calls
 * 
 * 2. All approaches handle:
 *    - Loading states
 *    - Error handling
 *    - Token authentication
 *    - Response parsing
 * 
 * 3. Combine approaches as needed:
 *    - Use hook for main data
 *    - Use Redux for mutations
 *    - Use API for special cases
 * 
 * 4. For custom components:
 *    - Import the hook/API you need
 *    - Follow the examples above
 *    - Handle loading and error states
 *    - Use existing UI components
 */
