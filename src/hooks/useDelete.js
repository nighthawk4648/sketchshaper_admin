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

  const [deleteSlider] = useDeleteSliderMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [deleteFooterPage] = useDeleteFooterPageMutation();
  const [deleteAssets] = useDeleteAssetsMutation();
  const [deleteSocial] = useDeleteSocialMutation();
  const [deleteBlogs] = useDeleteBlogsMutation();
  const [deleteSupportedBy] = useDeleteSupportedbyMutation();
  const [deleteInnovative] = useDeleteInnovativeMutation();
  const [deleteGallery] = useDeleteGalleryMutation();

  const getDeleteMutation = () => {
    if (pathArray.includes("slider")) return deleteSlider;
    if (pathArray.includes("category")) return deleteCategory;
    if (pathArray.includes("sub-category")) return deleteSubCategory;
    if (pathArray.includes("footer-page")) return deleteFooterPage;
    if (pathArray.includes("assets")) return deleteAssets;
    if (pathArray.includes("social")) return deleteSocial;
    if (pathArray.includes("blogs")) return deleteBlogs;
    if (pathArray.includes("supported-by")) return deleteSupportedBy;
    if (pathArray.includes("innovative")) return deleteInnovative;
    if (pathArray.includes("gallery")) return deleteGallery;
    return null;
  };

  const handleDelete = async (id) => {
    const deleteMutation = getDeleteMutation();
    if (!deleteMutation) {
      console.warn("No delete mutation found for current route:", pathname);
      return;
    }

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
          try {
            await deleteMutation(id).unwrap();
            Swal.fire("Deleted!", "Your record has been deleted.", "success");
          } catch (error) {
            console.error("Delete failed:", error);
            Swal.fire("Failed!", error?.data?.message || "Failed to delete the record.", "error");
          }
        }
      });
  };

  return {
    handleDelete,
  };
};

export default useDelete;
