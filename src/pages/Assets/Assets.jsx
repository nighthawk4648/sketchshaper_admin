import CustomPaginationTable from "@/components/shared/CustomTable/CustomPaginationTable";
import SkeletionTable from "@/components/skeleton/Table";
import envConfig from "@/configs/envConfig";
import useNoImage from "@/hooks/useNoImage";
import Icon from "@/components/ui/Icon";
import {
  useGetAssetsByPaginationQuery,
  useUpdateAssetAccessTypeMutation,
} from "@/store/api/app/Assets/assetsApiSlice";
import { useGetCategoriesQuery } from "@/store/api/app/Category/categoryApiSlice";
import { useGetSubCategoriesQuery } from "@/store/api/app/SubCategory/subCategoryApiSlice";
import { exportToExcel, exportToCsv } from "@/utils/exportToExcel";
import { stripHtml } from "@/utils/stripHtml";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Assets = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const limit = Number(params.get("limit")) || 10;
  const search = params.get("search") || "";
  const subCategoryId = params.get("sub_category_id") || "";

  const [subCategoryFilterQuery, setSubCategoryFilterQuery] = useState("");

  const update = (patch, options) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === "" || v === null || v === undefined) {
          next.delete(k);
        } else {
          next.set(k, String(v));
        }
      });
      return next;
    }, options);

  const setPage = (p) => update({ page: p });
  const setLimit = (l) => update({ limit: l, page: 1 }, { replace: true });
  const setSearch = (s) => update({ search: s, page: 1 }, { replace: true });

  const handleSelectSubCategory = (id) => {
    if (!id) {
      update({ sub_category_id: "", page: 1 }, { replace: true });
    } else {
      update({ sub_category_id: id, page: 1 }, { replace: true });
    }
  };

  const noImage = useNoImage();

  const { data: allCategoriesData } = useGetCategoriesQuery();
  const { data: subCategoriesData } = useGetSubCategoriesQuery();
  const subCategories = subCategoriesData?.data || [];

  const categoryMap = useMemo(() => {
    const map = new Map();
    (allCategoriesData?.data || []).forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [allCategoriesData]);

  const activeSubCategory = useMemo(() => {
    if (!subCategoryId) return null;
    return (
      subCategories.find((s) => String(s.id) === String(subCategoryId)) || null
    );
  }, [subCategoryId, subCategories]);

  const filteredSubCategories = useMemo(() => {
    if (!subCategoryFilterQuery.trim()) return subCategories;
    const q = subCategoryFilterQuery.toLowerCase().trim();
    return subCategories.filter((sub) => {
      const nameMatch = sub.name?.toLowerCase().includes(q);
      const catName = categoryMap.get(sub.category_id)?.toLowerCase() || "";
      return nameMatch || catName.includes(q);
    });
  }, [subCategories, subCategoryFilterQuery, categoryMap]);

  const [updateAssetAccessType] = useUpdateAssetAccessTypeMutation();

  const { data, isLoading } = useGetAssetsByPaginationQuery(
    {
      page: page,
      limit: limit,
      search: search,
      sub_category_id: subCategoryId,
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleToggleAccess = async (id, currentType) => {
    const nextType = currentType === "paid" ? "free" : "paid";
    try {
      await updateAssetAccessType({ id, access_type: nextType }).unwrap();
      toast.success(
        nextType === "paid" ? "⭐ Changed to PRO" : "🟢 Changed to FREE",
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
      Header: "Sub-Category",
      accessor: "sub_category.name",
      Cell: (row) => {
        const subCat = row?.cell?.row?.original?.sub_category;
        const catName =
          subCat?.category?.name ||
          (subCat?.category_id && categoryMap.get(subCat.category_id));

        if (!subCat?.name) return <span className="text-slate-400">—</span>;

        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {subCat.name}
            </span>
            {catName && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                📁 {catName}
              </span>
            )}
          </div>
        );
      },
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
            className={`px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isPaid
                ? "bg-[#FFF9E6] text-[#B8860B] border border-[#E8C96A] hover:bg-[#FDF2C7] dark:bg-[#322B15] dark:text-[#E8C96A] dark:border-[#5F5125] dark:hover:bg-[#43391C]"
                : "bg-[#EAFBF1] text-[#1E7E45] border border-[#A3E9BE] hover:bg-[#D5F7E2] dark:bg-[#162C1F] dark:text-[#4ADE80] dark:border-[#2E5C40] dark:hover:bg-[#20402E]"
            }`}
            title={
              isPaid
                ? "Current: PRO (Click to switch to FREE)"
                : "Current: FREE (Click to switch to PRO)"
            }
          >
            <span>{isPaid ? "PRO" : "FREE"}</span>
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
          asset.sub_category?.category?.name ||
          categoryMap.get(asset.sub_category?.category_id) ||
          "";
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

  // Left-Side Interactive Sub-Category Filter Box
  const leftContent = (
    <div className="flex items-center gap-2">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          className={`h-9 px-3 text-xs md:text-sm font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
            activeSubCategory
              ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-slate-700 dark:text-primary-300 dark:border-primary-400"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
          }`}
          title="Filter Assets by Sub-Category"
        >
          <Icon
            icon={activeSubCategory ? "heroicons:folder-open" : "heroicons:squares-2x2"}
            className={`text-base ${
              activeSubCategory
                ? "text-primary-600 dark:text-primary-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          />
          <span className="font-medium max-w-[150px] truncate">
            {activeSubCategory ? activeSubCategory.name : "All Sub-Categories"}
          </span>
          <Icon
            icon="heroicons:chevron-down"
            className="text-xs text-slate-400 ml-0.5"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 mt-2 w-72 rounded-lg bg-white dark:bg-slate-800 shadow-dropdown z-[9999] border border-slate-200 dark:border-slate-700 p-1.5 focus:outline-none">
            {/* Quick search input within popover */}
            <div className="p-1 mb-1">
              <div className="relative">
                <input
                  type="text"
                  value={subCategoryFilterQuery}
                  onChange={(e) => setSubCategoryFilterQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Search sub-category..."
                  className="form-control py-1.5 pl-8 pr-3 text-xs w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md"
                />
                <Icon
                  icon="heroicons:magnifying-glass"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-0.5">
              {/* Option: All Sub-Categories */}
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => handleSelectSubCategory("")}
                    className={`w-full text-left px-3 py-2 text-xs md:text-sm rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                      !subCategoryId
                        ? "bg-primary-50 text-primary-700 font-semibold dark:bg-slate-700 dark:text-primary-300"
                        : active
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="heroicons:squares-2x2"
                        className="text-base text-slate-400"
                      />
                      <span>All Sub-Categories (Show All)</span>
                    </div>
                    {!subCategoryId && (
                      <Icon
                        icon="heroicons:check"
                        className="text-primary-600 dark:text-primary-400 text-base shrink-0"
                      />
                    )}
                  </button>
                )}
              </Menu.Item>

              <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

              {/* Sub-Category List */}
              {filteredSubCategories.length === 0 ? (
                <div className="py-3 px-2 text-center text-xs text-slate-400">
                  No sub-categories found
                </div>
              ) : (
                filteredSubCategories.map((sub) => {
                  const isSelected = String(sub.id) === String(subCategoryId);
                  const parentCat = categoryMap.get(sub.category_id);

                  return (
                    <Menu.Item key={sub.id}>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => handleSelectSubCategory(sub.id)}
                          className={`w-full text-left px-3 py-2 text-xs md:text-sm rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary-50 text-primary-700 font-semibold dark:bg-slate-700 dark:text-primary-300"
                              : active
                              ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="truncate font-medium">{sub.name}</span>
                            {parentCat && (
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate">
                                📁 {parentCat}
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <Icon
                              icon="heroicons:check"
                              className="text-primary-600 dark:text-primary-400 text-base shrink-0"
                            />
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  );
                })
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Sibling Quick Reset Pill (Appears only when a sub-category is actively filtered) */}
      {activeSubCategory && (
        <button
          type="button"
          onClick={() => handleSelectSubCategory("")}
          className="h-9 px-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1 transition-colors cursor-pointer"
          title="Reset to All Sub-Categories"
        >
          <Icon icon="heroicons:x-mark" className="text-sm" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      )}
    </div>
  );

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
        leftContent={leftContent}
        defaultStatus={false}
        isView={false}
        isExcelExport={true}
        handleExport={handleExport}
      />
    </>
  );
};

export default Assets;
