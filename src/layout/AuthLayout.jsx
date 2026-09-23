import Loading from "@/components/Loading";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logOut } from "@/store/api/auth/authSlice";

const AuthLayout = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      dispatch(logOut());
      navigate("/login", { replace: true });
    }
  }, [isAuth, dispatch, navigate]);

  if (!isAuth) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default AuthLayout;
