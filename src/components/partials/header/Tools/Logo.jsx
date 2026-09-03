import useDarkMode from "@/hooks/useDarkMode";
import useWidth from "@/hooks/useWidth";
import { Link } from "react-router-dom";

import MobileLogoWhite from "@/assets/images/logo/nighthawk.png";
import MobileLogo from "@/assets/images/logo/nighthawk.png";
import LogoWhite from "@/assets/images/logo/nighthawk.png";
import MainLogo from "@/assets/images/logo/nighthawk.png";
const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/">
        {width >= breakpoints.xl ? (
          <img src={isDark ? LogoWhite : MainLogo} alt=""  />
        ) : (
          <img src={isDark ? MobileLogoWhite : MobileLogo} alt="" className="w-28 h-auto" />
        )}
      </Link>
    </div>
  );
};

export default Logo;
