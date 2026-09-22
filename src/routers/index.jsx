import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import Layout from "@/layout/Layout";

// Lazy-loaded pages
const Admin = lazy(() => import("@/pages/setting/admin/admin"));
const AdminAdd = lazy(() => import("@/pages/setting/admin/adminAdd"));
const AdminView = lazy(() => import("@/pages/setting/admin/adminView"));
const AdminEdit = lazy(() => import("@/pages/setting/admin/adminEdit"));
const Login = lazy(() => import("@/pages/auth/login"));
const Dashboard = lazy(() => import("@/pages/dashboard"));

// Slider
const Slider = lazy(() => import("@/pages/website/slider/slider"));
const SliderAdd = lazy(() => import("@/pages/website/slider/sliderAdd"));
const SliderEdit = lazy(() => import("@/pages/website/slider/sliderEdit"));
const SliderView = lazy(() => import("@/pages/website/slider/sliderView"));

// Category & SubCategory & Assets
const Category = lazy(() => import("@/pages/Category/Category"));
const AddCategory = lazy(() => import("@/pages/Category/AddCategory"));
const EditCategory = lazy(() => import("@/pages/Category/EditCategory"));
const SubCategory = lazy(() => import("@/pages/SubCategory/SubCategory"));
const SubCategoryCreate = lazy(
  () => import("@/pages/SubCategory/SubCategoryCreate"),
);
const SubCategoryEdit = lazy(
  () => import("@/pages/SubCategory/SubCategoryEdit"),
);
const Assets = lazy(() => import("@/pages/Assets/Assets"));
const AssetsCreate = lazy(() => import("@/pages/Assets/AssetsCreate"));
const AssetsEdit = lazy(() => import("@/pages/Assets/AssetsEdit"));

// Content
const Blogs = lazy(() => import("@/pages/Blogs/Blogs"));
const BlogsAdd = lazy(() => import("@/pages/Blogs/BlogsAdd"));
const BlogsForm = lazy(() => import("@/pages/Blogs/BlogsForm"));
const BlogsUpdate = lazy(() => import("@/pages/Blogs/BlogsUpdate"));
const BlogsView = lazy(() => import("@/pages/Blogs/BlogsView"));
const FooterPage = lazy(() => import("@/pages/FooterPage/FooterPage"));
const FooterPageCreate = lazy(
  () => import("@/pages/FooterPage/FooterPageCreate"),
);
const FooterPageEdit = lazy(() => import("@/pages/FooterPage/FooterPageEdit"));
const GeneralAbout = lazy(() => import("@/pages/GeneralAbout/GeneralAbout"));
const Innovative = lazy(() => import("@/pages/Innovative/Innovative"));
const InnovativeAdd = lazy(() => import("@/pages/Innovative/InnovativeAdd"));
const InnovativeEdit = lazy(() => import("@/pages/Innovative/InnovativeEdit"));
const Social = lazy(() => import("@/pages/Social/Social"));
const SocialCreate = lazy(() => import("@/pages/Social/SocialCreate"));
const SocialEdit = lazy(() => import("@/pages/Social/SocialEdit"));
const Gallery = lazy(() => import("@/pages/Gallery/Gallery"));
const AddGallery = lazy(() => import("@/pages/Gallery/AddGallery"));
const EditGallery = lazy(() => import("@/pages/Gallery/EditGallery"));

// Website Widgets
const AddSuportedBy = lazy(() => import("@/pages/SupportedBy/AddSuportedBy"));
const SupportedBy = lazy(() => import("@/pages/SupportedBy/SupportedBy"));
const UpdateSupportedBy = lazy(
  () => import("@/pages/SupportedBy/UpdateSupportedBy"),
);
const ApplicationSettings = lazy(
  () => import("@/pages/ApplicationSettings/ApplicationSettings"),
);

// Patreon
const PatreonDashboard = lazy(() => import("@/pages/Patreon/PatreonDashboard"));
const PatreonUsers = lazy(() => import("@/pages/Patreon/PatreonUsers"));
const PatreonUserDetail = lazy(
  () => import("@/pages/Patreon/PatreonUserDetail"),
);

// Contact
const ContactMessages = lazy(() => import("@/pages/Contact/ContactMessages"));

const router = createBrowserRouter([
  {
    path: "",
    // errorElement: <Error />,

    children: [
      {
        path: "",
        element: <AuthLayout />,
        children: [
          // add your routes here
          {
            path: "",
            element: <Layout />,
            children: [
              {
                path: "",
                element: <Dashboard />,
              },
            ],
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },

      // Don't use down below
      {
        path: "admin",
        element: <Layout type="admin" />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },

          {
            path: "slider",
            children: [
              {
                path: "",
                element: <Slider />,
              },
              {
                path: "new",
                element: <SliderAdd />,
              },
              {
                path: ":id",
                children: [
                  {
                    path: "",
                    element: <SliderView />,
                  },
                  {
                    path: "edit",
                    element: <SliderEdit />,
                  },
                ],
              },
            ],
          },

          {
            path: "category",
            children: [
              {
                path: "",
                element: <Category />,
              },
              {
                path: "new",
                element: <AddCategory />,
              },
              {
                path: ":id",
                children: [
                  // {
                  // 	path: '',
                  // 	element: <SliderView />,
                  // },
                  {
                    path: "edit",
                    element: <EditCategory />,
                  },
                ],
              },
            ],
          },

          {
            path: "sub-category",
            children: [
              {
                path: "",
                element: <SubCategory />,
              },
              {
                path: "new",
                element: <SubCategoryCreate />,
              },
              {
                path: ":id",
                children: [
                  // {
                  // 	path: '',
                  // 	element: <SliderView />,
                  // },
                  {
                    path: "edit",
                    element: <SubCategoryEdit />,
                  },
                ],
              },
            ],
          },

          {
            path: "assets",
            children: [
              {
                path: "",
                element: <Assets />,
              },
              {
                path: "new",
                element: <AssetsCreate />,
              },
              {
                path: ":id",
                children: [
                  // {
                  // 	path: '',
                  // 	element: <SliderView />,
                  // },
                  {
                    path: "edit",
                    element: <AssetsEdit />,
                  },
                ],
              },
            ],
          },

          {
            path: "social",
            children: [
              {
                path: "",
                element: <Social />,
              },
              {
                path: "new",
                element: <SocialCreate />,
              },
              {
                path: ":id",
                children: [
                  // {
                  // 	path: '',
                  // 	element: <SliderView />,
                  // },
                  {
                    path: "edit",
                    element: <SocialEdit />,
                  },
                ],
              },
            ],
          },

          {
            path: "general-about-us",
            children: [
              {
                path: "",
                element: <GeneralAbout />,
              },
            ],
          },

          {
            path: "footer-page",
            children: [
              {
                path: "",
                element: <FooterPage />,
              },
              {
                path: "new",
                element: <FooterPageCreate />,
              },
              {
                path: ":id",
                children: [
                  // {
                  // 	path: '',
                  // 	element: <SliderView />,
                  // },
                  {
                    path: "edit",
                    element: <FooterPageEdit />,
                  },
                ],
              },
            ],
          },

          {
            path: "application-settings",
            children: [
              {
                path: "",
                element: <ApplicationSettings />,
              },
            ],
          },

          {
            path: "admin",
            children: [
              {
                path: "",
                element: <Admin />,
              },
              {
                path: "new",
                element: <AdminAdd />,
              },
              {
                path: ":id",
                children: [
                  {
                    path: "",
                    element: <AdminView />,
                  },
                  {
                    path: "edit",
                    element: <AdminEdit />,
                  },
                ],
              },
            ],
          },

          {
            path: "blogs",
            children: [
              {
                path: "",
                element: <Blogs />,
              },
              {
                path: "new",
                element: <BlogsAdd />,
              },
              {
                path: ":id",
                children: [
                  {
                    path: "",
                    element: <BlogsView />,
                  },
                  {
                    path: "edit",
                    element: <BlogsUpdate />,
                  },
                ],
              },
            ],
          },

          {
            path: "supported-by",
            children: [
              {
                path: "",
                element: <SupportedBy />,
              },
              {
                path: "new",
                element: <AddSuportedBy />,
              },
              {
                path: ":id",
                children: [
                  {
                    path: "edit",
                    element: <UpdateSupportedBy />,
                  },
                ],
              },
            ],
          },

          {
            path: "innovative",
            children: [
              {
                path: "",
                element: <Innovative />,
              },
              {
                path: "new",
                element: <InnovativeAdd />,
              },
              {
                path: ":id",
                children: [
                  {
                    path: "edit",
                    element: <InnovativeEdit />,
                  },
                ],
              },
            ],
          },

          {
            path: "gallery",
            children: [
              {
                path: "",
                element: <Gallery />,
              },
              {
                path: "new",
                element: <AddGallery />,
              },
              {
                path: ":id",
                children: [
                  {
                    path: "edit",
                    element: <EditGallery />,
                  },
                ],
              },
            ],
          },

          {
            path: "patreon",
            children: [
              {
                path: "",
                element: <PatreonDashboard />,
              },
              {
                path: "users",
                children: [
                  {
                    path: "",
                    element: <PatreonUsers />,
                  },
                  {
                    path: ":id",
                    element: <PatreonUserDetail />,
                  },
                ],
              },
            ],
          },

          {
            path: "contact-messages",
            element: <ContactMessages />,
          },
        ],
      },
    ],
  },
]);

export default router;
