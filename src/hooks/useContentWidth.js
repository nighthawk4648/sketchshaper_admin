import { handleContentWidth } from "@/store/layout";
import { useDispatch, useSelector } from "react-redux";

const useContentWidth = () => {
  const dispatch = useDispatch();
  const contentWidth = useSelector((state) => state.layout.contentWidth);

  // ** Toggles Content Width
  const setContentWidth = (val) => dispatch(handleContentWidth(val));

  return [contentWidth, setContentWidth];
};

export default useContentWidth;
