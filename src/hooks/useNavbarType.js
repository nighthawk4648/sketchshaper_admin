import { handleNavBarType } from "@/store/layout";
import { useDispatch, useSelector } from "react-redux";

const useNavbarType = () => {
  const dispatch = useDispatch();
  const navbarType = useSelector((state) => state.layout.navBarType);
  const setNavbarType = (val) => dispatch(handleNavBarType(val));
  return [navbarType, setNavbarType];
};

export default useNavbarType;
