import { useGetPatreonUsersQuery, useRevokePatreonUserMutation } from '@/store/api/app/Patreon/patreonApiSlice';
import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for Patreon admin operations
 * Provides unified access to Patreon subscriber data, analytics stats, and actions
 */
export const usePatreon = ({
	initialPage = 1,
	initialLimit = 10,
	initialOrder = 'desc',
	initialSearch = '',
	initialStatus = '',
} = {}) => {
	const [page, setPage] = useState(initialPage);
	const [limit, setLimit] = useState(initialLimit);
	const [order, setOrder] = useState(initialOrder);
	const [search, setSearch] = useState(initialSearch);
	const [status, setStatus] = useState(initialStatus);

	// Fetch users from RTK Query
	const { data, isLoading, isError, error, isFetching } = useGetPatreonUsersQuery({
		page,
		limit,
		order,
		search,
		status,
	});

	// Revoke user access mutation
	const [revokeUser, { isLoading: isRevoking }] = useRevokePatreonUserMutation();

	// Calculate unified statistics (revenue, conversion, tier breakdown)
	const stats = useMemo(() => {
		const users = data?.data?.result || [];
		const activePatrons = users.filter((u) => u.is_active_patron).length;
		const totalRevenue = users
			.filter((u) => u.is_active_patron)
			.reduce((sum, u) => sum + (u.pledge_amount_cents || 0), 0);

		const activeUsersList = users.filter((u) => u.is_active_patron);
		const tierBreakdown = {
			basic: activeUsersList.filter((u) => u.membership_tier === 'basic').length,
			standard: activeUsersList.filter((u) => u.membership_tier === 'standard').length,
			premium: activeUsersList.filter((u) => u.membership_tier === 'premium').length,
		};

		return {
			totalUsers: users.length,
			activePatrons,
			inactivePatrons: users.length - activePatrons,
			totalRevenue,
			averagePledge: activePatrons > 0 ? totalRevenue / activePatrons : 0,
			conversionRate: users.length > 0 ? (activePatrons / users.length) * 100 : 0,
			tierBreakdown,
		};
	}, [data]);

	// Filter helpers
	const filterByTier = useCallback(
		(tier) => {
			return data?.data?.result?.filter((u) => u.membership_tier === tier) || [];
		},
		[data]
	);

	const filterByStatus = useCallback(
		(isActive) => {
			return data?.data?.result?.filter((u) => u.is_active_patron === isActive) || [];
		},
		[data]
	);

	const resetFilters = useCallback(() => {
		setSearch('');
		setStatus('');
		setPage(1);
		setLimit(10);
		setOrder('desc');
	}, []);

	return {
		// Data
		users: data?.data?.result || [],
		pagination: data?.data?.pagination,
		stats,

		// Loading & Error states
		isLoading,
		isError,
		error,
		isFetching,
		isRevoking,

		// Query Controls
		page,
		setPage,
		limit,
		setLimit,
		order,
		setOrder,
		search,
		setSearch,
		status,
		setStatus,

		// Actions & Utilities
		revokeUser,
		filterByTier,
		filterByStatus,
		resetFilters,
	};
};

export default usePatreon;
