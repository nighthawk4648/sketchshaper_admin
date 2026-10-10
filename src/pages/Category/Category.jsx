


import CustomPaginationTable from '@/components/shared/CustomTable/CustomPaginationTable';
import SkeletionTable from '@/components/skeleton/Table';
import envConfig from '@/configs/envConfig';
import useNoImage from '@/hooks/useNoImage';
import { useGetCategoriesByPaginationQuery } from '@/store/api/app/Category/categoryApiSlice';
import { exportToExcel, exportToCsv } from '@/utils/exportToExcel';
import { stripHtml } from '@/utils/stripHtml';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Category = () => {
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

	const { data, isLoading, isError, error, isFetching } =
		useGetCategoriesByPaginationQuery({
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
			Header: 'Category Image',
			accessor: 'image',
			Cell: (row) => (
				<img
					src={`${envConfig.apiImgUrl}${row?.cell?.value}`}
					alt="slider"
					className="h-20 w-auto object-cover rounded-lg"
					onError={(e) => {
                        e.target.onerror = null; // Prevents looping
                        e.target.src = noImage;
                    }}
				/>
			),
		},
		{
			Header: 'Title',
			accessor: 'name',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
		{
			Header: 'Short Description',
			accessor: 'short_description',
			Cell: (row) => <span>{row?.cell?.value}</span>,
		},
	];

	const handleExport = (format = 'xlsx') => {
		try {
			const categories = data?.data?.result || [];
			if (!categories.length) {
				toast.info('No categories to export');
				return;
			}

			const exportRows = categories.map((cat) => {
				const subCats = Array.isArray(cat.sub_categories) ? cat.sub_categories : [];
				const subCatNames = subCats.map((s) => s.name).join(', ');

				let formattedDate = '';
				if (cat.created_at) {
					const d = new Date(cat.created_at);
					if (!isNaN(d.getTime())) {
						formattedDate = d.toISOString().slice(0, 10);
					}
				}

				return {
					'Category ID': cat.id,
					'Name': cat.name || '',
					'Description': stripHtml(cat.short_description),
					'Meta Title': stripHtml(cat.meta_title),
					'Meta Description': stripHtml(cat.meta_description),
					'Keywords': cat.keywords || '',
					'Total Sub-Categories': subCats.length,
					'Sub-Categories List': subCatNames || 'None',
					'Created At': formattedDate,
				};
			});

			const fileName = `Categories_${new Date().toISOString().slice(0, 10)}`;
			if (format === 'csv') {
				exportToCsv(exportRows, fileName);
			} else {
				exportToExcel(exportRows, fileName);
			}
		} catch (err) {
			console.error('Export error:', err);
			toast.error('Failed to export categories: ' + (err?.message || 'Unknown error'));
		}
	};

	return (
		<>
			<CustomPaginationTable
				title="Categories"
				COLUMNS={COLUMNS}
				data={data?.data}
				paginationPage={page}
				setPaginationPage={setPage}
				limit={limit}
				setLimit={setLimit}
				search={search}
				setSearch={setSearch}
				defaultStatus={false}
				isExcelExport={true}
				handleExport={handleExport}
			/>
		</>
	);
};

export default Category;
