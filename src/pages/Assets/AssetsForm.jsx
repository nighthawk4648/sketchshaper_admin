import SelectSubCategory from "@/components/shared/Select/SelectSubCategory";
import TextEditor from "@/components/shared/Select/TextEditor";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import envConfig from "@/configs/envConfig";
import useSubmit from "@/hooks/useSubmit";
import {
  useCreateAssetsMutation,
  useUpdateAssetsMutation,
} from "@/store/api/app/Assets/assetsApiSlice";
import AssetsChunkedUploader from "@/utils/AssetsChunkedUploader";
import UploadQueue from "@/utils/UploadQueue";
import { apiSlice } from "@/store/api/apiSlice";

import { useEffect, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AssetsForm = ({ id, data, refetch }) => {
  const dispatch = useDispatch();
  const { isAuth, auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const uploadQueueRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploads, setUploads] = useState([]);
  const [assetId, setAssetId] = useState(id || null);
  const [isAssetCreated, setIsAssetCreated] = useState(!!id);
  const [existingFile, setExistingFile] = useState(data?.file || null);

  console.log("will be update", data);

  const {
    register,
    unregister,
    control,
    errors,
    reset,
    handleSubmit,
    onSubmit,
    watch,
    isLoading,
  } = useSubmit(
    id,
    id ? useUpdateAssetsMutation : useCreateAssetsMutation,
    false,
  );

  const { append, remove, fields } = useFieldArray({
    control,
    name: "images",
  });

  // Initialize upload queue
  useEffect(() => {
    uploadQueueRef.current = new UploadQueue(1, (queueStatus) => {
      // Update UI when queue status changes
      const allItems = [
        ...queueStatus.all.queued,
        ...queueStatus.all.active,
        ...queueStatus.all.completed,
        ...queueStatus.all.failed,
      ];

      setUploads((prev) => {
        return prev.map((upload) => {
          const queueItem = allItems.find((item) => item.id === upload.id);
          if (queueItem) {
            // Show toast notification on completion
            if (
              queueItem.status === "completed" &&
              upload.status !== "completed"
            ) {
              toast.success(`✅ ${upload.name} uploaded successfully!`);
              dispatch(apiSlice.util.invalidateTags(["assets"]));
              if (refetch) refetch();

              if (queueItem.result?.file) {
                setExistingFile(queueItem.result.file);
              } else {
                setExistingFile({
                  main_file: upload.name,
                  file_type: "." + upload.name.split(".").pop(),
                  file_size: upload.size,
                  upload_status: "completed",
                  upload_progress: 100,
                  uploaded_chunks: upload.totalChunks,
                  total_chunks: upload.totalChunks,
                });
              }
            }
            // Show toast notification on failure
            if (queueItem.status === "failed" && upload.status !== "failed") {
              toast.error(`❌ Failed to upload ${upload.name}`);
            }
            return {
              ...upload,
              status: queueItem.status,
            };
          }
          return upload;
        });
      });
    });

    return () => {
      uploadQueueRef.current?.clear();
    };
  }, []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (!assetId) {
      toast.error("❌ Please create the asset first before uploading files");
      return;
    }

    files.forEach((file) => {
      let itemId = null;

      const uploader = new AssetsChunkedUploader(
        file,
        (progress) => {
          // Update progress for the specific upload item
          setUploads((prev) => {
            const updated = prev.map((u) =>
              u.id === itemId
                ? {
                    ...u,
                    progress: progress.progress,
                    uploadedChunks: progress.uploadedChunks,
                    totalChunks: progress.totalChunks,
                  }
                : u,
            );
            console.log(
              "Progress update for",
              itemId,
              ":",
              progress.progress.toFixed(2) + "%",
            );
            return updated;
          });
        },
        envConfig.apiUrl,
        assetId,
      );

      itemId = uploadQueueRef.current.add(uploader, {
        fileName: file.name,
        fileSize: file.size,
      });

      setUploads((prev) => [
        ...prev,
        {
          id: itemId,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "queued",
          uploadedChunks: 0,
          totalChunks: uploader.totalChunks,
          uploader,
        },
      ]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePause = (id) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload) {
      upload.uploader.pause();
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "paused" } : u)),
      );
    }
  };

  const handleResume = async (id) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload) {
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "uploading" } : u)),
      );
      await uploadQueueRef.current.resume(id);
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "completed" } : u)),
      );
    }
  };

  const handleCancel = async (id) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload) {
      await uploadQueueRef.current.cancel(id);
      setUploads((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleRemove = (id) => {
    uploadQueueRef.current.remove(id);
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "uploading":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFormSubmit = async (data) => {
    console.log("data", data);

    const formData = new FormData();

    const keys = Object.keys(data);

    keys.forEach((key) => {
      if (["cover"].includes(key)) {
        if (data[key]) {
          formData.append(key, data[key][0]);
        }
      } else if (key === "images") {
        data[key].forEach((image) => {
          console.log("image", image.image);
          if (image.image?.[0]) {
            formData.append("images", image.image[0]);
          }
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    // Step 1: Create/Update asset
    const response = await onSubmit(formData);

    // Step 2: If asset created successfully, set the asset ID
    if (response?.id) {
      setAssetId(response.id);
      setIsAssetCreated(true);
      toast.success("✅ Asset created successfully! Now you can upload files.");
    }
  };

  useEffect(() => {
    reset({
      name: data?.name,
      size: data?.size,
      resolution: data?.resolution,
      short_description: data?.short_description,
      sub_category_id: data?.sub_category?.id,
      images: data?.images || [
        {
          id: null,
          image: null,
        },
      ],

      meta_title: data?.meta_title,
      meta_description: data?.meta_description,
    });

    // Set existing file if updating
    if (data?.file) {
      setExistingFile(data.file);
    }
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card title={id ? "Edit Assets" : "Create New Assets"}>
        <div className="grid grid-cols-1 gap-5">
          <Textinput
            register={register}
            label="Name"
            type="text"
            placeholder="Asset Name"
            name="name"
            required={true}
            error={errors?.name}
          />

          <div>
            <label htmlFor="" className="text-sm">
              Select Sub Category
            </label>
            <div className="mt-3">
              <SelectSubCategory
                control={control}
                errors={errors}
                defaultValue={data?.sub_category?.id}
              />
            </div>
          </div>

          <Textinput
            register={register}
            label="Size"
            type="text"
            placeholder="Size"
            name="size"
            required={true}
            error={errors?.size}
          />

          <Textinput
            register={register}
            label="Resolution"
            type="text"
            placeholder="Resolution"
            name="resolution"
            required={true}
            error={errors?.resolution}
          />

          <Textarea
            name="short_description"
            register={register}
            label="Short Description"
            type="textarea"
            placeholder="Short Description"
            row={6}
            required={true}
            error={errors?.short_description}
          />

          <Fileinput
            selectedFile={watch("cover")?.[0]}
            name={"cover"}
            label="Cover Image"
            defaultUrl={data?.cover}
            preview={true}
            control={control}
          />

          <Textinput
            register={register}
            label="Meta Title"
            type="text"
            placeholder="Meta Title"
            name="meta_title"
            required={false}
            error={errors?.meta_title}
          />

          <div>
            <p className="mb-2 text-sm font-semibold">Meta Description</p>
            <TextEditor
              name="meta_description"
              errors={errors}
              control={control}
              required={false}
            />
          </div>

          <div>
            {fields.map((item, index) => {
              const allImages = watch("images");
              const imageValue = allImages?.[index]?.image;
              const selectedFile =
                imageValue &&
                Array.isArray(imageValue) &&
                imageValue.length > 0 &&
                typeof imageValue[0] !== "string"
                  ? imageValue[0]
                  : null;

              return (
                <Fileinput
                  key={`image-${index}-${item.id}`}
                  selectedFile={selectedFile}
                  name={`images.${index}.image`}
                  label={`Asset Image ${index + 1}`}
                  defaultUrl={data?.images?.[index]?.image}
                  preview={true}
                  control={control}
                  classLabel={"mt-2"}
                />
              );
            })}
            <div className="text-center mt-3 flex gap-3 justify-center">
              <Button
                text="Remove Last Image"
                className={`btn-danger ${
                  data?.images?.length >= fields.length ? "hidden" : ""
                }`}
                onClick={() => remove(fields.length - 1)}
              />

              <Button
                text="Add More Image"
                className="btn-dark"
                onClick={() => append({ id: fields.length + 1, image: null })}
              />
            </div>
          </div>

          {isAssetCreated && (
            <>
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Upload Asset Files
                </h3>

                {existingFile && (
                  <Card
                    title="Current File"
                    className="mb-4 bg-green-50 border-green-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-700">
                            {existingFile.main_file?.split("/").pop() || "File"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            File Type:{" "}
                            <span className="font-semibold">
                              {existingFile.file_type}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Chunks:{" "}
                            <span className="font-semibold">
                              {existingFile.uploaded_chunks}/
                              {existingFile.total_chunks}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 text-xs font-bold rounded bg-green-200 text-green-800">
                            {existingFile.upload_status?.toUpperCase()}
                          </span>
                          <p className="text-sm font-bold text-green-600 mt-2">
                            {existingFile.upload_progress}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${existingFile.upload_progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="asset-file-input"
                  />
                  <label htmlFor="asset-file-input" className="cursor-pointer">
                    <div className="text-gray-600">
                      <p className="text-lg font-medium">
                        Drag & Drop Files Here
                      </p>
                      <p className="text-sm">or click to select files</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Upload your asset files
                      </p>
                    </div>
                  </label>
                </div>

                {uploads.length > 0 && (
                  <Card title="Upload Queue" className="mt-4">
                    <div className="space-y-4">
                      {uploads.map((upload) => (
                        <div
                          key={upload.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate">
                                  {upload.name}
                                </p>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                                    upload.status,
                                  )}`}
                                >
                                  {upload.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {formatBytes(upload.size)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {upload.uploadedChunks}/{upload.totalChunks}{" "}
                                chunks
                              </p>
                              <p className="text-xs text-gray-500">
                                {upload.progress.toFixed(2)}%
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="w-full bg-gray-300 rounded-full h-3 mb-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${upload.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-600">
                                {upload.uploadedChunks}/{upload.totalChunks}{" "}
                                chunks
                              </span>
                              <span className="text-xs font-bold text-blue-600">
                                {upload.progress.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {upload.status === "uploading" && (
                              <Button
                                onClick={() => handlePause(upload.id)}
                                text="Pause"
                                className="btn-light btn-sm"
                              />
                            )}
                            {upload.status === "paused" && (
                              <Button
                                onClick={() => handleResume(upload.id)}
                                text="Resume"
                                className="btn-dark btn-sm"
                              />
                            )}
                            {(upload.status === "queued" ||
                              upload.status === "paused" ||
                              upload.status === "uploading") && (
                              <Button
                                onClick={() => handleCancel(upload.id)}
                                text="Cancel"
                                className="btn-light btn-sm"
                              />
                            )}
                            {(upload.status === "completed" ||
                              upload.status === "failed" ||
                              upload.status === "cancelled") && (
                              <Button
                                onClick={() => handleRemove(upload.id)}
                                text="Remove"
                                className="btn-light btn-sm"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>

        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse mt-6">
          <Button
            onClick={() => navigate(-1)}
            text="Cancel"
            className="btn-light"
          />
          <Button
            isLoading={isLoading}
            type="submit"
            text={id ? "Update Asset" : "Create Asset"}
            className="btn-dark"
          />
          {isAssetCreated && (
            <Button
              onClick={() => navigate(-1)}
              text="Done"
              className="btn-success"
            />
          )}
        </div>
      </Card>
    </form>
  );
};

export default AssetsForm;
