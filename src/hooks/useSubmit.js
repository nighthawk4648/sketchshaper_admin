import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useSubmit = (id, hook, redirect, formOptions = {}) => {
  const navigate = useNavigate();

  const {
    register,
    unregister,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
    setError,
  } = useForm(formOptions);

  const isDualHook =
    hook && typeof hook === "object" && hook.create && hook.update;
  const [createSubmit, createStatus] = isDualHook ? hook.create() : [null, {}];
  const [updateSubmit, updateStatus] = isDualHook ? hook.update() : [null, {}];
  const [singleSubmit, singleStatus] =
    !isDualHook && typeof hook === "function" ? hook() : [null, {}];

  const isLoading = isDualHook
    ? Boolean(createStatus?.isLoading || updateStatus?.isLoading)
    : Boolean(singleStatus?.isLoading);

  const onSubmit = async (preparedData, customId) => {
    try {
      const targetId = customId !== undefined ? customId : id;
      let response;
      if (isDualHook) {
        response = await (targetId
          ? updateSubmit({ id: targetId, data: preparedData })
          : createSubmit(preparedData));
      } else {
        response = await (targetId
          ? singleSubmit({ id: targetId, data: preparedData })
          : singleSubmit(preparedData));
      }

      if (response?.error) {
        const errorMsg =
          response.error?.data?.message ||
          response.error?.message ||
          "Error occurred from server!";
        if (
          response.error?.status === 409 ||
          response.error?.code === 409 ||
          errorMsg.toLowerCase().includes("slug")
        ) {
          setError("slug", { type: "manual", message: errorMsg });
        }
        throw new Error(errorMsg);
      }

      const { data } = response;

      if (data?.status !== "success") {
        const errorMsg = data?.message || "Error occurred from server!";
        if (errorMsg.toLowerCase().includes("slug")) {
          setError("slug", { type: "manual", message: errorMsg });
        }
        throw new Error(errorMsg);
      }
      if (redirect !== false) {
        reset();
        navigate(redirect ? redirect : -1);
      }
      toast.success(data?.message);
      return data?.data; // return created/updated entity so callers can chain actions
    } catch (error) {
      console.log(error);
      if (error?.message && error.message.toLowerCase().includes("slug")) {
        setError("slug", { type: "manual", message: error.message });
      }
      toast.error(error.message || "Something went wrong!");
      return null; // explicit null on failure
    }
  };

  return {
    register,
    unregister,
    control,
    errors,
    reset,
    handleSubmit,
    watch,
    setValue,
    setError,
    onSubmit,
    isLoading,
  };
};

export default useSubmit;
