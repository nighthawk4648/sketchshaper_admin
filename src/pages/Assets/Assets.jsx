import CustomPaginationTable from "@/components/shared/CustomTable/CustomPaginationTable";
import SkeletionTable from "@/components/skeleton/Table";
import envConfig from "@/configs/envConfig";
import useNoImage from "@/hooks/useNoImage";
import {
  useGetAssetsByPaginationQuery,
  useUpdateAssetAccessTypeMutation,
} from "@/store/api/app/Assets/assetsApiSlice";
import { useGetCategoriesQuery } from "@/store/api/app/Category/categoryApiSlice";
import { exportToExcel, exportToCsv } from "@/utils/exportToExcel";
import { stripHtml } from "@/utils/stripHtml";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Assets = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 10;
  const search = params.get("search") || "";

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

  const categoryMap = useMemo(() => {
    const map = new Map();
    (allCategoriesData?.data || []).forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [allCategoriesData]);

  const [updateAssetAccessType] = useUpdateAssetAccessTypeMutation();

  const { data, isLoading } = useGetAssetsByPaginationQuery(
    {
      page: page,
      limit: limit,
      search: search,
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleToggleAccess = async (id, currentType) => {
    const nextType = currentType === "paid" ? "free" : "paid";
    try {
      await updateAssetAccessType({ id, access_type: nextType }).unwrap();
      toast.success(
        nextType === "paid" ? "💎 Changed to Paid" : "🟢 Changed to Free",
      );
    } catch (error) {
      toast.error("Failed to update access type");
    }
  };

  if (isLoading) return <SkeletionTable />;

  const COLUMNS = [
    {
      Header: "Asset Cover",
      accessor: "cover",
      Cell: (row) => {
        const cover = row?.cell?.value;
        const imgSrc = cover
          ? `${envConfig.apiImgUrl || "http://localhost:5000/api/uploads/"}${cover}`
          : noImage;

        return (
          <img
            src={imgSrc}
            alt="Asset Cover"
            className="h-20 w-auto object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = noImage;
            }}
          />
        );
      },
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Size",
      accessor: "size",
      Cell: (row) => {
        const val = row?.cell?.value;
        if (val && String(val).trim() !== "") {
          return <span>{val}</span>;
        }
        const file = row?.cell?.row?.original?.file;
        if (file?.file_size) {
          const num = Number(file.file_size);
          if (!isNaN(num) && num > 0) {
            const k = 1024;
            const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
            const i = Math.floor(Math.log(num) / Math.log(k));
            const formatted =
              parseFloat((num / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
            return <span>{formatted}</span>;
          }
        }
        return <span>—</span>;
      },
    },
    {
      Header: "Resolution",
      accessor: "resolution",
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Attached 3D File",
      accessor: "file",
      Cell: (row) => {
        const file = row?.cell?.row?.original?.file;
        if (!file || !file.main_file) {
          return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              ⚠️ No 3D File
            </span>
          );
        }

        const fileName = file.main_file.split("/").pop();
        const formattedSize = file.file_size
          ? `${(Number(file.file_size) / (1024 * 1024)).toFixed(1)} MB`
          : "0 MB";

        return (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold uppercase text-[10px]">
                {file.file_type || ".skp"}
              </span>
              <span
                className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]"
                title={fileName}
              >
                {fileName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>{formattedSize}</span>
              <span>•</span>
              <span
                className={
                  file.upload_status === "completed"
                    ? "text-emerald-600 font-semibold"
                    : "text-amber-600 font-semibold"
                }
              >
                {file.upload_status === "completed"
                  ? "✓ 100% Ready"
                  : file.upload_status}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      Header: "Access Type",
      accessor: "access_type",
      Cell: (row) => {
        const isPaid = row?.cell?.value === "paid";
        const id = row?.cell?.row?.original?.id;

        return (
          <button
            type="button"
            onClick={() => handleToggleAccess(id, row?.cell?.value)}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isPaid
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 hover:bg-purple-200 border border-purple-300 dark:border-purple-700"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-700"
            }`}
            title="Click to toggle between Free and Paid"
          >
            <span>{isPaid ? "💎 Paid" : "🟢 Free"}</span>
          </button>
        );
      },
    },
  ];

  const handleExport = (format = "xlsx") => {
    try {
      const assets = data?.data?.result || [];
      if (!assets.length) {
        toast.info("No assets to export");
        return;
      }

      const exportRows = assets.map((asset) => {
        const categoryName =
          categoryMap.get(asset.sub_category?.category_id) || "";
        const subCategoryName = asset.sub_category?.name || "";
        const fileName = asset.file?.main_file
          ? String(asset.file.main_file).split("/").pop()
          : "";

        let formattedDate = "";
        if (asset.created_at) {
          const d = new Date(asset.created_at);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toISOString().slice(0, 10);
          }
        }

        return {
          "Asset ID": asset.id,
          "Name": asset.name || "",
          "Category": categoryName,
          "Sub-Category": subCategoryName,
          "Access Type": asset.access_type || "free",
          "Resolution": asset.resolution || "",
          "Size": asset.size || "",
          "Attached 3D File": fileName || "No 3D File",
          "Download Link": asset.download_link || "",
          "Description": stripHtml(asset.short_description),
          "Meta Title": stripHtml(asset.meta_title),
          "Meta Description": stripHtml(asset.meta_description),
          "Keywords": asset.keywords || "",
          "Created At": formattedDate,
        };
      });

      const fileName = `Assets_${new Date().toISOString().slice(0, 10)}`;
      if (format === "csv") {
        exportToCsv(exportRows, fileName);
      } else {
        exportToExcel(exportRows, fileName);
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error(
        "Failed to export assets: " + (err?.message || "Unknown error"),
      );
    }
  };

  return (
    <>
      <CustomPaginationTable
        title="Assets"
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

export default Assets;
