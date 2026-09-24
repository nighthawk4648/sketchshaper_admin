import SelectCategory from "@/components/shared/Select/SelectCategory";
import TextEditor from "@/components/shared/Select/TextEditor";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import useSubmit from "@/hooks/useSubmit";
import {
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/store/api/app/SubCategory/subCategoryApiSlice";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SubCategoryForm = ({ id, data }) => {
  const { isAuth, auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
    id ? useUpdateSubCategoryMutation : useCreateSubCategoryMutation,
  );

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "image") {
        const imageValue = data[key];
        const hasNewImage =
          imageValue instanceof File ||
          imageValue instanceof Blob ||
          (imageValue && imageValue[0] instanceof File);

        if (hasNewImage) {
          formData.append("image", imageValue[0] || imageValue);
        } else if (typeof imageValue === "string" && imageValue.trim() !== "") {
          formData.append("image", imageValue);
        }
      } else {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }
    });

    await onSubmit(formData);
  };

  useEffect(() => {
    reset({
      name: data?.name,
      short_description: data?.short_description,
      category_id: data?.category_id,
      meta_title: data?.meta_title || "",
      meta_description: data?.meta_description || "",
      keywords: data?.keywords || "",
    });
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {id
              ? `Edit Sub-Category: ${data?.name || ""}`
              : "Create New Sub-Category"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {id
              ? "Update sub-category classification, parent association, visual asset, and SEO"
              : "Create a new sub-category linked to a parent category with SEO metadata"}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            text="Cancel"
            className="btn-light btn-sm"
          />
          <Button
            isLoading={isLoading}
            type="submit"
            text={id ? "Update Sub-Category" : "Create Sub-Category"}
            className="btn-dark btn-sm"
          />
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: General Information & Media (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <Card title="General Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textinput
                  register={register}
                  label="Sub-Category Name"
                  type="text"
                  placeholder="e.g. Living Room, Sofas, Lighting"
                  name="name"
                  required={true}
                  error={errors?.name}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Parent Category
                  </label>
                  <SelectCategory
                    control={control}
                    errors={errors}
                    defaultValue={data?.category_id}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Short Description
                </label>
                <Textarea
                  name="short_description"
                  register={register}
                  placeholder="Overview of models and components organized in this sub-category..."
                  row={4}
                  required={true}
                  error={errors?.short_description}
                />
              </div>
            </div>
          </Card>

          <Card title="Visual Asset">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sub-Category Cover Image{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (Sub-category card thumbnail)
                  </span>
                </label>
                <Fileinput
                  selectedFile={watch("image")?.[0]}
                  name="image"
                  defaultUrl={data?.image}
                  preview={true}
                  control={control}
                  onClear={() => {
                    setValue("image", null);
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: SEO Metadata (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          <Card title="Search Engine Optimization (SEO)">
            <div className="space-y-4">
              <Textinput
                register={register}
                label="Meta Title"
                type="text"
                placeholder="e.g. Modern Sofas & Living Room 3D Models | SketchShaper"
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

              <Textarea
                name="keywords"
                register={register}
                label="Keywords"
                type="textarea"
                placeholder="Comma-separated keywords (e.g. sofas, living room, modern furniture)"
                row={3}
                required={false}
                error={errors?.keywords}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          type="button"
          onClick={() => navigate(-1)}
          text="Cancel"
          className="btn-light"
        />
        <Button
          isLoading={isLoading}
          type="submit"
          text={id ? "Update Sub-Category" : "Save Sub-Category"}
          className="btn-dark"
        />
      </div>
    </form>
  );
};

export default SubCategoryForm;
