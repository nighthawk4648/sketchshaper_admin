import TextEditor from "@/components/shared/Select/TextEditor";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import useSubmit from "@/hooks/useSubmit";
import {
  useCreateFooterPageMutation,
  useUpdateFooterPageMutation,
} from "@/store/api/app/FooterPage/footerPageApiSlice";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FooterPageForm = ({ id, data }) => {
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
    id ? useUpdateFooterPageMutation : useCreateFooterPageMutation,
  );

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    const keys = Object.keys(data);

    keys.forEach((key) => {
      if (["cover"].includes(key)) {
        const fileValue = data[key];
        const hasNewFile =
          fileValue instanceof File ||
          fileValue instanceof Blob ||
          (fileValue && fileValue[0] instanceof File);

        if (hasNewFile) {
          formData.append(key, fileValue[0] || fileValue);
        } else if (typeof fileValue === "string" && fileValue.trim() !== "") {
          formData.append(key, fileValue);
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
      title: data?.title,
      short_description: data?.short_description,
      content: data?.content,
      cover: data?.cover || null,
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
              ? `Edit Custom Page: ${data?.title || ""}`
              : "Create New Custom Page"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {id
              ? "Update page content, rich text body, and search engine optimization"
              : "Draft and publish a new custom content page with SEO metadata"}
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
            text={id ? "Update Page" : "Create Page"}
            className="btn-dark btn-sm"
          />
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Page Content (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <Card title="Page Content">
            <div className="space-y-4">
              <Textinput
                register={register}
                label="Page Title"
                type="text"
                placeholder="e.g. Terms and Conditions, Privacy Policy, About Us"
                name="title"
                required={true}
                error={errors?.title}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Short Description
                </label>
                <Textarea
                  name="short_description"
                  register={register}
                  placeholder="Summary or subtitle for this custom page..."
                  row={3}
                  required={true}
                  error={errors?.short_description}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Body Content
                </label>
                <TextEditor
                  name="content"
                  errors={errors}
                  control={control}
                  required={false}
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
                placeholder="e.g. Terms & Conditions | SketchShaper"
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
                placeholder="Comma-separated keywords (e.g. terms, privacy, sketchshaper)"
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
          text={id ? "Update Page" : "Save Page"}
          className="btn-dark"
        />
      </div>
    </form>
  );
};

export default FooterPageForm;
