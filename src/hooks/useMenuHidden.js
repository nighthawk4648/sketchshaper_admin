import { handleMenuHidden } from "@/store/layout";
import { useDispatch, useSelector } from "react-redux";

const useMenuHidden = () => {
  const dispatch = useDispatch();
  const menuHidden = useSelector((state) => state.layout.menuHidden);

  const setMenuHidden = (value) => {
    dispatch(handleMenuHidden(value));
  };

  return [menuHidden, setMenuHidden];
};

export default useMenuHidden;
