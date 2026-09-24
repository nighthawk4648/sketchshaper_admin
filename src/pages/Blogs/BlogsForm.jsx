import TextEditor from "@/components/shared/Select/TextEditor";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import useSubmit from "@/hooks/useSubmit";
import {
  useCreateBlogsMutation,
  useUpdateBlogsMutation,
} from "@/store/api/app/Blogs/BlogsApiSlice";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BlogsForm = ({ id, data }) => {
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
  } = useSubmit(id, id ? useUpdateBlogsMutation : useCreateBlogsMutation);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    const keys = Object.keys(data);

    keys.forEach((key) => {
      if (["image", "bgImage"].includes(key)) {
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
      name: data?.name,
      title: data?.title,
      short_description: data?.short_description,
      back_link: data?.back_link,
      paragraph_one: data?.paragraph_one,
      paragraph_two: data?.paragraph_two,
      paragraph_three: data?.paragraph_three,
      image_alt: data?.image_alt || "",
      bg_image_alt: data?.bg_image_alt || "",
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
            {id ? `Edit Blog: ${data?.title || ""}` : "Create New Blog"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {id
              ? "Update article content, media attachments, and search engine optimization"
              : "Draft and publish a new article with structured content and SEO metadata"}
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
            text={id ? "Update Blog" : "Create Blog"}
            className="btn-dark btn-sm"
          />
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Article Content (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          <Card title="Article Content">
            <div className="space-y-4">
              <Textinput
                register={register}
                label="Article Title"
                type="text"
                placeholder="e.g. 10 Essential Modeling Techniques for Architecture"
                name="title"
                required={true}
                error={errors?.title}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Short Description / Summary
                </label>
                <Textarea
                  name="short_description"
                  register={register}
                  placeholder="A concise summary of the article displayed on blog cards and listings..."
                  row={3}
                  required={true}
                  error={errors?.short_description}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Paragraph One (Introduction)
                </label>
                <TextEditor
                  name="paragraph_one"
                  errors={errors}
                  control={control}
                  required={false}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Paragraph Two (Core Body)
                </label>
                <TextEditor
                  name="paragraph_two"
                  errors={errors}
                  control={control}
                  required={false}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Paragraph Three (Conclusion & Insights)
                </label>
                <TextEditor
                  name="paragraph_three"
                  errors={errors}
                  control={control}
                  required={false}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Publishing, Media & SEO (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Card 1: Author & Publishing */}
          <Card title="Author & Attribution">
            <div className="space-y-4">
              <Textinput
                register={register}
                label="Author / Contributor Name"
                type="text"
                placeholder="e.g. SketchShaper Editorial Team"
                name="name"
                required={true}
                error={errors?.name}
              />

              <Textinput
                register={register}
                label="Back Link / Reference URL"
                type="text"
                placeholder="https://example.com/reference-article"
                name="back_link"
                required={false}
                error={errors?.back_link}
              />
            </div>
          </Card>

          {/* Card 2: Visual Assets */}
          <Card title="Media & Visual Assets">
            <div className="space-y-5">
              {/* Featured Card Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Featured Card Image
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
                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Featured Image Alt Text{" "}
                      <span className="text-slate-400 font-normal">
                        (SEO & Accessibility)
                      </span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {(watch("image_alt") || "").length}/125
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={125}
                    placeholder={`Default: ${watch("title") || "Blog Title"}`}
                    {...register("image_alt")}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Background / Banner Visual */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Article Banner / Background Visual
                </label>
                <Fileinput
                  selectedFile={watch("bgImage")?.[0]}
                  name="bgImage"
                  defaultUrl={data?.bgImage}
                  preview={true}
                  control={control}
                  onClear={() => {
                    setValue("bgImage", null);
                  }}
                />
                <div className="mt-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Banner Image Alt Text{" "}
                      <span className="text-slate-400 font-normal">
                        (SEO & Accessibility)
                      </span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {(watch("bg_image_alt") || "").length}/125
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={125}
                    placeholder={`Default: ${watch("title") || "Blog Title"}`}
                    {...register("bg_image_alt")}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Card 3: SEO Card */}
          <Card title="Search Engine Optimization (SEO)">
            <div className="space-y-4">
              <Textinput
                register={register}
                label="Meta Title"
                type="text"
                placeholder="e.g. 10 SketchUp Architectural Tips | SketchShaper"
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
                placeholder="Comma-separated keywords (e.g. sketchup, 3d modeling, architecture)"
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
          text={id ? "Update Blog" : "Save Blog"}
          className="btn-dark"
        />
      </div>
    </form>
  );
};

export default BlogsForm;
