import { handleFooterType } from "@/store/layout";
import { useDispatch, useSelector } from "react-redux";

const useFooterType = () => {
  const dispatch = useDispatch();
  const footerType = useSelector((state) => state.layout.footerType);
  const setFooterType = (val) => dispatch(handleFooterType(val));
  return [footerType, setFooterType];
};

export default useFooterType;
