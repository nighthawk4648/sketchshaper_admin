import SelectSubCategory from "@/components/shared/Select/SelectSubCategory";
import TextEditor from "@/components/shared/Select/TextEditor";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";
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
import { Controller, useFieldArray } from "react-hook-form";
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
  const [selectedModelFile, setSelectedModelFile] = useState(null); // staged file before submit
  const [isUploading, setIsUploading] = useState(false); // locks button during chunked upload
  const [removedImageIds, setRemovedImageIds] = useState([]); // DB AssetImage ids staged for deletion on save
  const [deleteExistingFile, setDeleteExistingFile] = useState(false); // flag to delete current 3D file on save

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
    setValue,
    isLoading,
  } = useSubmit(
    id,
    id ? useUpdateAssetsMutation : useCreateAssetsMutation,
    false,
  );

  const { append, remove, fields } = useFieldArray({
    control,
    name: "images",
    keyName: "fieldId",
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

              setIsUploading(false); // release button lock

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

              // Auto-redirect only in Create mode (Edit mode stays on the edit page)
              if (!id) {
                setTimeout(() => navigate("/admin/assets"), 1500);
              }
            }
            // Show toast notification on failure
            if (queueItem.status === "failed" && upload.status !== "failed") {
              toast.error(`❌ Failed to upload ${upload.name}`);
              setIsUploading(false); // release button lock on failure too
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

  // Only store the file in state; upload is triggered after form submit
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedModelFile(file);
    // Reset input so the same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Called internally from handleFormSubmit after the asset record is created
  const startChunkedUpload = (file, targetAssetId) => {
    setIsUploading(true);
    let itemId = null;

    const uploader = new AssetsChunkedUploader(
      file,
      (progress) => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === itemId
              ? {
                  ...u,
                  progress: progress.progress,
                  uploadedChunks: progress.uploadedChunks,
                  totalChunks: progress.totalChunks,
                }
              : u,
          ),
        );
      },
      envConfig.apiUrl,
      targetAssetId,
    );

    itemId = uploadQueueRef.current.add(uploader, {
      fileName: file.name,
      fileSize: file.size,
    });

    setUploads([
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
        const coverValue = data[key];
        const hasNewCover =
          coverValue instanceof File ||
          coverValue instanceof Blob ||
          (coverValue && coverValue[0] instanceof File);

        if (hasNewCover) {
          formData.append(key, coverValue[0] || coverValue);
        } else if (typeof coverValue === "string" && coverValue.trim() !== "") {
          formData.append(key, coverValue);
        }
      } else if (key === "images") {
        // Handled below with tempId and alt association
      } else {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }
    });

    // Handle gallery images & alt texts paired by tempId (new) or DB id (existing)
    const newImageAlts = [];
    const existingImageAlts = [];

    if (Array.isArray(data.images)) {
      data.images.forEach((item) => {
        const imgVal = item?.image;
        const hasNewImg =
          imgVal instanceof File ||
          imgVal instanceof Blob ||
          (imgVal && imgVal[0] instanceof File);

        if (hasNewImg) {
          const file = imgVal[0] || imgVal;
          const tempId =
            item.tempId ||
            (typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `temp_${Date.now()}_${Math.random()}`);
          formData.append(`image_${tempId}`, file);
          newImageAlts.push({
            tempId,
            alt: item?.alt?.trim() ? item.alt.trim().slice(0, 125) : "",
          });
        } else if (item?.id && !removedImageIds.includes(item.id)) {
          existingImageAlts.push({
            id: item.id,
            alt: item?.alt?.trim() ? item.alt.trim().slice(0, 125) : "",
          });
        }
      });
    }

    formData.append("newImageAlts", JSON.stringify(newImageAlts));
    formData.append("existingImageAlts", JSON.stringify(existingImageAlts));

    // Always append size: auto-computed from file if selected, otherwise empty string
    // (backend will overwrite with actual size after upload completes)
    formData.append(
      "size",
      selectedModelFile ? formatBytes(selectedModelFile.size) : "",
    );

    // Append staged image removals — backend reads removedImageIds[0], removedImageIds[1], ...
    removedImageIds.forEach((imgId, i) => {
      formData.append(`removedImageIds[${i}]`, imgId);
    });

    // Tell backend to delete the existing 3D file only if no new file is replacing it
    if (deleteExistingFile && !selectedModelFile) {
      formData.append("delete_file", "true");
    }

    // Step 1: Create / Update asset record
    const createdAsset = await onSubmit(formData);

    // Clear staged removal state after successful save
    if (createdAsset) {
      setRemovedImageIds([]);
      setDeleteExistingFile(false);
    }

    // Step 2: If asset was created/found and a 3D file is staged, start chunked upload
    const targetId = createdAsset?.id || assetId;
    if (selectedModelFile && targetId) {
      setAssetId(targetId);
      setIsAssetCreated(true);
      startChunkedUpload(selectedModelFile, targetId);
      // Upload completion triggers auto-redirect (see UploadQueue callback)
    }
  };

  useEffect(() => {
    reset({
      name: data?.name,
      resolution: data?.resolution,
      short_description: data?.short_description,
      sub_category_id: data?.sub_category?.id,
      cover_alt: data?.cover_alt || "",
      images:
        data?.images && data.images.length > 0
          ? data.images.map((img) => ({
              id: img.id,
              defaultUrl: img.image,
              image: img.image,
              alt: img.alt || "",
              tempId: null,
            }))
          : [
              {
                id: null,
                defaultUrl: null,
                image: null,
                alt: "",
                tempId:
                  typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `temp_${Date.now()}`,
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {id ? `Edit Asset: ${data?.name || ""}` : "Create New Asset"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {id
              ? "Update asset metadata, thumbnail, gallery images, and 3D model"
              : "Upload 3D models and attach media assets in a single step"}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            text="Cancel"
            className="btn-light btn-sm"
          />
          {isAssetCreated && (
            <Button
              type="button"
              onClick={() => navigate(-1)}
              text="Done"
              className="btn-success btn-sm"
            />
          )}
          <Button
            isLoading={isLoading || isUploading}
            type="submit"
            text={
              isUploading && uploads.length > 0
                ? `Uploading... ${uploads[0]?.progress?.toFixed(0) ?? 0}%`
                : id
                  ? "Update Asset"
                  : "Create Asset"
            }
            className="btn-dark btn-sm"
          />
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: General Information & Media Assets (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Card 1: General Information */}
          <Card title="General Information">
            <div className="space-y-4">
              <Textinput
                register={register}
                label="Asset Name"
                type="text"
                placeholder="e.g. Modern Scandinavian Armchair"
                name="name"
                required={true}
                error={errors?.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Sub Category
                  </label>
                  <SelectSubCategory
                    control={control}
                    errors={errors}
                    defaultValue={data?.sub_category?.id}
                  />
                </div>
                <div>
                  <Textinput
                    register={register}
                    label="Resolution / Specs"
                    type="text"
                    placeholder="e.g. 4K Textures / 45K Polys"
                    name="resolution"
                    required={true}
                    error={errors?.resolution}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Short Description
                </label>
                <TextEditor
                  name="short_description"
                  errors={errors}
                  control={control}
                  required={false}
                />
              </div>
            </div>
          </Card>

          {/* Card 2: Media & Image Gallery */}
          <Card title="Media & Visual Assets">
            <div className="space-y-6">
              {/* Primary Cover Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Primary Cover Image{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (Main catalog thumbnail)
                  </span>
                </label>
                <Fileinput
                  selectedFile={watch("cover")?.[0]}
                  name={"cover"}
                  label="Select Cover Image"
                  defaultUrl={data?.cover}
                  preview={true}
                  control={control}
                  onClear={() => {
                    setValue("cover", null);
                  }}
                />
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Cover Image Alt Text{" "}
                      <span className="text-slate-400 font-normal">
                        (SEO & Accessibility)
                      </span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {(watch("cover_alt") || "").length}/125
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={125}
                    placeholder={`Default: ${watch("name") || "Asset Name"}`}
                    {...register("cover_alt")}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Gallery Images Section */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Gallery Images
                    </h4>
                    <p className="text-xs text-slate-400">
                      Additional perspective renders and detail photos
                    </p>
                  </div>
                  <Button
                    type="button"
                    text="+ Add Slot"
                    className="btn-outline-dark btn-sm py-1 px-3 text-xs"
                    onClick={() =>
                      append({
                        id: null,
                        defaultUrl: null,
                        image: null,
                        alt: "",
                        tempId:
                          typeof crypto !== "undefined" && crypto.randomUUID
                            ? crypto.randomUUID()
                            : `temp_${Date.now()}`,
                      })
                    }
                  />
                </div>

                {/* Gallery Thumbnail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {fields.map((item, index) => {
                    const allImages = watch("images");
                    const imageValue = allImages?.[index]?.image;
                    const dbImageId = item?.id || allImages?.[index]?.id;
                    const isImageRemoved =
                      dbImageId && removedImageIds.includes(dbImageId);

                    // Field-scoped default image url
                    const existingImageUrl =
                      !isImageRemoved &&
                      (item?.defaultUrl ||
                        (typeof item?.image === "string" ? item.image : null));

                    const selectedFile =
                      imageValue &&
                      Array.isArray(imageValue) &&
                      imageValue.length > 0 &&
                      typeof imageValue[0] !== "string"
                        ? imageValue[0]
                        : null;

                    const hasExistingDbImage =
                      dbImageId && typeof dbImageId === "number";

                    const previewSrc = selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : existingImageUrl
                        ? envConfig.apiImgUrl + existingImageUrl
                        : null;

                    return (
                      <div
                        key={item.fieldId || `image-${index}`}
                        className="flex flex-col"
                      >
                        <div className="relative aspect-square rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 shadow-sm hover:shadow transition flex items-center justify-center overflow-visible">
                          {/* Top-Right Red Circular Cross (X) Button */}
                          <button
                            type="button"
                            title="Remove this image"
                            onClick={() => {
                              if (hasExistingDbImage) {
                                setRemovedImageIds((prev) => [
                                  ...prev,
                                  dbImageId,
                                ]);
                              }
                              remove(index);
                            }}
                            className="absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer border-2 border-white dark:border-slate-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                            </svg>
                          </button>

                          {/* Image Preview or File Picker */}
                          {previewSrc ? (
                            <div className="w-full h-full rounded-xl overflow-hidden p-1 flex items-center justify-center bg-white dark:bg-slate-900">
                              <img
                                src={previewSrc}
                                alt={`Gallery Image ${index + 1}`}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                          ) : (
                            <Controller
                              name={`images.${index}.image`}
                              control={control}
                              render={({ field: { onChange, ref } }) => (
                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-3 text-center text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition group">
                                  <input
                                    type="file"
                                    className="hidden"
                                    ref={ref}
                                    accept="image/*"
                                    onChange={(e) => {
                                      const files = e.target.files;
                                      onChange(files);
                                      if (
                                        files &&
                                        files.length > 0 &&
                                        !allImages?.[index]?.tempId
                                      ) {
                                        const newTempId =
                                          typeof crypto !== "undefined" &&
                                          crypto.randomUUID
                                            ? crypto.randomUUID()
                                            : `temp_${Date.now()}`;
                                        setValue(
                                          `images.${index}.tempId`,
                                          newTempId,
                                        );
                                      }
                                    }}
                                  />
                                  <div className="w-9 h-9 rounded-full bg-slate-200/70 dark:bg-slate-700/70 flex items-center justify-center mb-1 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                      />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-medium">
                                    Select Photo
                                  </span>
                                </label>
                              )}
                            />
                          )}
                        </div>

                        {/* Alt Text Input below image */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                              Alt Text
                            </label>
                            <span className="text-[10px] text-slate-400">
                              {(watch(`images.${index}.alt`) || "").length}/125
                            </span>
                          </div>
                          <input
                            type="text"
                            maxLength={125}
                            placeholder={`Default: ${watch("name") || "Asset Name"}`}
                            {...register(`images.${index}.alt`)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* "+ Add Image" Dashed Card */}
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        id: null,
                        defaultUrl: null,
                        image: null,
                        alt: "",
                        tempId:
                          typeof crypto !== "undefined" && crypto.randomUUID
                            ? crypto.randomUUID()
                            : `temp_${Date.now()}`,
                      })
                    }
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition cursor-pointer p-3 group bg-white/50 dark:bg-slate-800/40"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-1 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold">Add Image</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: 3D Model & SEO Metadata (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Card 3: 3D Model Asset */}
          <Card title="3D Model Asset">
            <div className="space-y-4">
              {/* Existing 3D File in Database */}
              {existingFile && !isUploading && (
                <div className="border border-green-200 dark:border-green-800 bg-green-50/70 dark:bg-green-900/10 rounded-xl p-4 relative shadow-sm">
                  <button
                    type="button"
                    title="Remove 3D file (will delete on Save)"
                    onClick={() => {
                      setDeleteExistingFile(true);
                      setExistingFile(null);
                    }}
                    className="absolute -top-2.5 -right-2.5 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer border-2 border-white dark:border-slate-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-green-200 dark:bg-green-800/60 text-green-800 dark:text-green-200 font-bold text-sm flex items-center justify-center shadow-inner">
                      3D
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {existingFile.main_file?.split("/").pop() ||
                          "Current 3D Model"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Type:{" "}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {existingFile.file_type || ".skp"}
                        </span>
                        {data?.size && (
                          <span>
                            {" "}
                            • Size:{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {data.size}
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                      ATTACHED
                    </span>
                  </div>
                </div>
              )}

              {/* Staged New 3D File (Ready to Upload) */}
              {selectedModelFile && !isUploading && (
                <div className="border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-900/10 rounded-xl p-4 relative shadow-sm">
                  <button
                    type="button"
                    title="Cancel selected file"
                    onClick={() => setSelectedModelFile(null)}
                    className="absolute -top-2.5 -right-2.5 z-20 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer border-2 border-white dark:border-slate-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-blue-200 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200 font-bold text-sm flex items-center justify-center shadow-inner">
                      3D
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 truncate">
                        {selectedModelFile.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                        {formatBytes(selectedModelFile.size)} • Ready to upload
                        on save
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      STAGED
                    </span>
                  </div>
                </div>
              )}

              {/* Upload Progress Bar */}
              {isUploading && uploads.length > 0 && (
                <div className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 space-y-3">
                  {uploads.map((upload) => (
                    <div key={upload.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-medium text-sm truncate">
                            {upload.name}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded mt-1 ${getStatusColor(
                              upload.status,
                            )}`}
                          >
                            {upload.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <p className="text-xs font-semibold text-blue-600">
                            {upload.progress.toFixed(1)}%
                          </p>
                          <p className="text-xs text-slate-500">
                            {upload.uploadedChunks}/{upload.totalChunks} chunks
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropzone for 3D model (visible when not uploading and no new file staged) */}
              {!isUploading && !selectedModelFile && (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition bg-slate-50/50 dark:bg-slate-800/40">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="asset-file-input"
                    accept=".skp,.zip"
                  />
                  <label
                    htmlFor="asset-file-input"
                    className="cursor-pointer block"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {existingFile
                          ? "Replace with new 3D File"
                          : "Choose 3D Model File"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supported formats: .skp, .zip
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </Card>

          {/* Card 4: Search Engine Optimization (SEO) */}
          <Card title="Search Engine Optimization (SEO)">
            <div className="space-y-4">
              <Textinput
                register={register}
                label="Meta Title"
                type="text"
                placeholder="e.g. Modern Scandinavian Armchair 3D Model"
                name="meta_title"
                required={false}
                error={errors?.meta_title}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Meta Description
                </label>
                <TextEditor
                  name="meta_description"
                  errors={errors}
                  control={control}
                  required={false}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default AssetsForm;
