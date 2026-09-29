import { useGetSubCategoriesQuery } from "@/store/api/app/SubCategory/subCategoryApiSlice";
import { Controller } from "react-hook-form";
import ReactSelectError from "./ReactSelectError";
import SelectCustom from "./SelectCustom";

const SelectSubCategory = ({
  errors,
  control,
  setState,
  setItem,
  state,
  defaultValue,
  isMarked,
  isDisabled,
  name,
}) => {
  const { data, isLoading } = useGetSubCategoriesQuery();

  const options = data?.data?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Controller
        name={name || "sub_category_id"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <SelectCustom
            name={name || "sub_category_id"}
            isMarked={isMarked || Boolean(errors?.[name || "sub_category_id"])}
            defaultValue={defaultValue}
            selectedValue={options?.find(
              (val) => val.value === (value || defaultValue),
            )}
            options={options}
            onChange={onChange}
            setState={setState}
            setItem={setItem}
            isDisabled={isDisabled}
          />
        )}
        rules={{ required: "Sub Category is required!" }}
      />
      <ReactSelectError errorName={errors?.[name || "sub_category_id"]} />
    </>
  );
};

export default SelectSubCategory;
