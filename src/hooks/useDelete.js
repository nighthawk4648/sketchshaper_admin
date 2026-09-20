import { useDeleteAssetsMutation } from "@/store/api/app/Assets/assetsApiSlice";
import { useDeleteBlogsMutation } from "@/store/api/app/Blogs/BlogsApiSlice";
import { useDeleteCategoryMutation } from "@/store/api/app/Category/categoryApiSlice";
import { useDeleteFooterPageMutation } from "@/store/api/app/FooterPage/footerPageApiSlice";
import { useDeleteGalleryMutation } from "@/store/api/app/Gallery/galleryApiSlice";
import { useDeleteInnovativeMutation } from "@/store/api/app/Innovative/InnovativeAPiSlice";
import { useDeleteSocialMutation } from "@/store/api/app/Social/socialApiSlice";
import { useDeleteSubCategoryMutation } from "@/store/api/app/SubCategory/subCategoryApiSlice";
import { useDeleteSupportedbyMutation } from "@/store/api/app/SupportedBy/supportedByApiSlice";
import { useDeleteSliderMutation } from "@/store/api/app/website/slider/sliderApiSlice";

import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const useDelete = () => {
  const { pathname } = useLocation();
  const pathArray = pathname.split("/");

  let hook = null;

  if (pathArray.includes("slider")) {
    hook = useDeleteSliderMutation;
  } else if (pathArray.includes("category")) {
    hook = useDeleteCategoryMutation;
  } else if (pathArray.includes("sub-category")) {
    hook = useDeleteSubCategoryMutation;
  } else if (pathArray.includes("footer-page")) {
    hook = useDeleteFooterPageMutation;
  } else if (pathArray.includes("assets")) {
    hook = useDeleteAssetsMutation;
  } else if (pathArray.includes("social")) {
    hook = useDeleteSocialMutation;
  } else if (pathArray.includes("blogs")) {
    hook = useDeleteBlogsMutation;
  } else if (pathArray.includes("supported-by")) {
    hook = useDeleteSupportedbyMutation;
  } else if (pathArray.includes("innovative")) {
    hook = useDeleteInnovativeMutation;
  } else if (pathArray.includes("gallery")) {
    hook = useDeleteGalleryMutation;
  }

  const [deleteRecord, { isLoading, isError, error, isSuccess }] = hook
    ? hook()
    : [
        () => {},
        {
          isLoading: false,
          isError: false,
          error: null,
          isSuccess: false,
        },
      ];

  const handleDelete = async (id) => {
    withReactContent(Swal)
      .fire({
        title: "Are you sure?",
        text: "You will not be able to recover this record!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          // Delete the record
          try {
            await deleteRecord(id);

            if (isError) {
              throw new Error(error?.message || "Something went wrong!");
            }

            Swal.fire("Deleted!", "Your record has been deleted.", "success");
          } catch (error) {
            console.log(error);
            Swal.fire("Failed!", "Failed to delete the record.", "error");
          }
        }
      });
  };

  return {
    handleDelete,
  };
};

export default useDelete;
