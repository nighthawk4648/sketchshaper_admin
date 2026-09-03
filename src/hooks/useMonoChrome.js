import { handleMonoChrome } from "@/store/layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useMonoChrome = () => {
  const dispatch = useDispatch();
  const isMonoChrome = useSelector((state) => state.layout.isMonochrome);

  const setMonoChrome = (val) => dispatch(handleMonoChrome(val));

  useEffect(() => {
    const element = document.getElementsByTagName("html")[0];

    if (isMonoChrome) {
      element.classList.add("grayscale");
    } else {
      element.classList.remove("grayscale");
    }
  }, [isMonoChrome]);

  return [isMonoChrome, setMonoChrome];
};

export default useMonoChrome;
