import CustomPaginationTable from "@/components/shared/CustomTable/CustomPaginationTable";
import SkeletionTable from "@/components/skeleton/Table";
import envConfig from "@/configs/envConfig";
import useNoImage from "@/hooks/useNoImage";
import {
  useGetAssetsByPaginationQuery,
  useUpdateAssetAccessTypeMutation,
} from "@/store/api/app/Assets/assetsApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";

const Assets = () => {
  const [paginationPage, setPaginationPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const noImage = useNoImage();

  const [updateAssetAccessType] = useUpdateAssetAccessTypeMutation();

  const { data, isLoading } = useGetAssetsByPaginationQuery({
    page: paginationPage,
    limit: limit,
    order: order,
    search: search,
  });

  const handleToggleAccess = async (id, currentType) => {
    const nextType = currentType === "paid" ? "free" : "paid";
    try {
      await updateAssetAccessType({ id, access_type: nextType }).unwrap();
      toast.success(
        nextType === "paid" ? "💎 Changed to Paid" : "🟢 Changed to Free"
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
      Cell: (row) => <span>{row?.cell?.value}</span>,
    },
    {
      Header: "Resolution",
      accessor: "resolution",
      Cell: (row) => <span>{row?.cell?.value}</span>,
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

  return (
    <>
      <CustomPaginationTable
        title="Assets"
        COLUMNS={COLUMNS}
        data={data?.data}
        paginationPage={paginationPage}
        setPaginationPage={setPaginationPage}
        limit={limit}
        setLimit={setLimit}
        order={order}
        setOrder={setOrder}
        search={search}
        setSearch={setSearch}
        defaultStatus={false}
        isView={false}
      />
    </>
  );
};

export default Assets;
