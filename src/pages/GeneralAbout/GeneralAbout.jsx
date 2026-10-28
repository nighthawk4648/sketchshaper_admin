import TextEditor from "@/components/shared/Select/TextEditor";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import envConfig from "@/configs/envConfig";
import useSubmit from "@/hooks/useSubmit";
import {
  useCreateGeneralAboutUsMutation,
  useGetGeneralAboutUsQuery,
} from "@/store/api/app/GeneralAbout/generalAboutApiSlice";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GeneralAbout = ({ id }) => {
  const { isAuth, auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: generalAbout } = useGetGeneralAboutUsQuery();
  const data = generalAbout?.data;

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
    id ? useCreateGeneralAboutUsMutation : useCreateGeneralAboutUsMutation,
  );

  const handleFormSubmit = async (formDataValues) => {
    const formData = new FormData();

    const keys = Object.keys(formDataValues);

    keys.forEach((key) => {
      if (["cover"].includes(key)) {
        const fileValue = formDataValues[key];
        const hasNewFile =
          fileValue instanceof File ||
          fileValue instanceof Blob ||
          (fileValue && fileValue[0] instanceof File);

        if (hasNewFile) {
          formData.append(key, fileValue[0] || fileValue);
        } else if (typeof fileValue === "string" && fileValue.trim() !== "") {
          formData.append(key, fileValue);
        } else if (data?.cover) {
          formData.append(key, data.cover);
        }
      } else {
        if (formDataValues[key] !== undefined && formDataValues[key] !== null) {
          formData.append(key, formDataValues[key]);
        }
      }
    });

    if (!formData.has("cover") && data?.cover) {
      formData.append("cover", data.cover);
    }

    await onSubmit(formData);
  };

  useEffect(() => {
    reset({
      title: data?.title || "",
      short_description: data?.short_description || "",
      content: data?.content || "",
      cover: data?.cover || "",
    });
  }, [data]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card title={id ? "General About Us" : "General About Us"}>
        <div className="grid grid-cols-1 gap-5">
          <Textinput
            register={register}
            label="Title"
            type="text"
            placeholder="Title"
            name="title"
            required={true}
            error={errors?.title}
          />

          <Textarea
            name="short_description"
            register={register}
            label="Short Description"
            type="textarea"
            placeholder="short_description"
            row={6}
            required={true}
            error={errors?.short_description}
          />

          {/* <Textinput
						register={register}
						label="Name"
						type="text"
						placeholder="Name"
						name="name"
						required={false}
						error={errors?.name}
					/> */}

          <Fileinput
            selectedFile={watch("cover")?.[0]}
            name={"cover"}
            defaultUrl={data?.cover}
            preview={true}
            control={control}
          />

          <TextEditor
            name="content"
            errors={errors}
            control={control}
            required={false}
          />
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
            text="Save"
            className="btn-dark"
          />
        </div>
      </Card>
    </form>
  );
};

export default GeneralAbout;
