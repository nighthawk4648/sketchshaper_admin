import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetSubCategoriesByPaginationQuery } from '@/store/api/app/SubCategory/subCategoryApiSlice';
import { useGetCategoriesQuery } from '@/store/api/app/Category/categoryApiSlice';
import { exportToExcel, exportToCsv } from '@/utils/exportToExcel';
import { stripHtml } from '@/utils/stripHtml';
import { toast } from 'react-toastify';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const SubCategory = () => {
	const [params, setParams] = useSearchParams();
	const page = Number(params.get('page')) || 1;
	const limit = Number(params.get('limit')) || 10;
	const search = params.get('search') || '';

	const update = (patch, options) =>
		setParams((prev) => {
			const next = new URLSearchParams(prev);
			Object.entries(patch).forEach(([k, v]) => next.set(k, String(v)));
			return next;
		}, options);

	const setPage = (p) => update({ page: p });
	const setLimit = (l) => update({ limit: l, page: 1 }, { replace: true });
	const setSearch = (s) => update({ search: s, page: 1 }, { replace: true });

	const noImage = useNoImage();

	const { data: allCategoriesData } = useGetCategoriesQuery();

	const subCategoryAssetsMap = useMemo(() => {
		const map = new Map();
		const categories = allCategoriesData?.data || [];
		categories.forEach((cat) => {
			if (Array.isArray(cat.sub_categories)) {
				cat.sub_categories.forEach((sub) => {
					map.set(sub.id, sub.assets || []);
				});
			}
		});
		return map;
	}, [allCategoriesData]);

	const { data, isLoading, isError, error, isFetching } =
		useGetSubCategoriesByPaginationQuery({
			page: page,
			limit: limit,
			search: search,
		});

	if (isLoading) return <SkeletionTable />;
	// if (!data?.data?.result?.length) {
	// 	return <h1 className="text-2xl font-bold">No Data Found</h1>
	// }

	const COLUMNS = [
		{
			Header: 'Sub-Category Image',
			accessor: 'image',
			Cell: (row) => (
				<img
					src={`${envConfig.apiImgUrl}${row?.cell?.value}`}
					alt="sub-category"
					className="h-20 w-auto object-cover rounded-lg"
					onError={(e) => {
                        e.target.onerror = null; // Prevents looping
                        e.target.src = noImage;
                    }}
				/>
			),
		},
		{
			Header: 'Name',
			accessor: 'name',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
		{
			Header: 'Short Description',
			accessor: 'short_description',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},

        {
			Header: 'Category',
			accessor: 'category.name',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
	];

	const handleExport = (format = 'xlsx') => {
		try {
			const subCategories = data?.data?.result || [];
			if (!subCategories.length) {
				toast.info('No sub-categories to export');
				return;
			}

			const exportRows = subCategories.map((subCat) => {
				const assets = subCategoryAssetsMap.get(subCat.id) || [];
				const categoryName = subCat.category?.name || '';

				let formattedDate = '';
				if (subCat.created_at) {
					const d = new Date(subCat.created_at);
					if (!isNaN(d.getTime())) {
						formattedDate = d.toISOString().slice(0, 10);
					}
				}

				return {
					'Sub-Category ID': subCat.id,
					'Name': subCat.name || '',
					'Category': categoryName,
					'Description': stripHtml(subCat.short_description),
					'Meta Title': stripHtml(subCat.meta_title),
					'Meta Description': stripHtml(subCat.meta_description),
					'Keywords': subCat.keywords || '',
					'Total Assets': assets.length,
					'Created At': formattedDate,
				};
			});

			const fileName = `SubCategories_${new Date().toISOString().slice(0, 10)}`;
			if (format === 'csv') {
				exportToCsv(exportRows, fileName);
			} else {
				exportToExcel(exportRows, fileName);
			}
		} catch (err) {
			console.error('Export error:', err);
			toast.error('Failed to export sub-categories: ' + (err?.message || 'Unknown error'));
		}
	};

	return (
		<>
			<CustomPaginationTable
				title="Sub Categories"
				COLUMNS={COLUMNS}
				data={data?.data}
				paginationPage={page}
				setPaginationPage={setPage}
				limit={limit}
				setLimit={setLimit}
				search={search}
				setSearch={setSearch}
				defaultStatus={false}
				isView={false}
				isExcelExport={true}
				handleExport={handleExport}
			/>
		</>
	);
};

export default SubCategory;
