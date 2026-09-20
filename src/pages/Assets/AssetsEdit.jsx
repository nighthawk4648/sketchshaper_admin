import SkeletionTable from "@/components/skeleton/Table";
import { useGetAssetsByIdQuery } from "@/store/api/app/Assets/assetsApiSlice";
import React from "react";
import { useParams } from "react-router-dom";
import AssetsForm from "./AssetsForm";

const AssetsEdit = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useGetAssetsByIdQuery(
    id,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  if (isLoading) {
    return <SkeletionTable />;
  }

  if (isError || !data?.data) {
    return (
      <div className="p-8 bg-white dark:bg-slate-800 rounded-xl text-center space-y-3">
        <h3 className="text-lg font-semibold text-red-500">Asset Not Found</h3>
        <p className="text-sm text-slate-500">
          {error?.data?.message || `Could not load asset with ID #${id}`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <AssetsForm id={id} data={data?.data} refetch={refetch} />
    </div>
  );
};

export default AssetsEdit;
