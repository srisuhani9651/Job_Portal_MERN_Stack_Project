import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  Outlet,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import AppliedJobs from "./components/AppliedJobs";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import JobByAdmin from "./components/admin/JobByAdmin";
import PostJobs from "./components/admin/PostJobs";
import Applicants from "./components/admin/Applicants";
import JobSetup from "./components/admin/JobSetup";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search]);

  return <Outlet />;
};

const appRouter = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/browse",
        element: <Browse />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/applied-jobs",
        element: <AppliedJobs />,
      },
      {
        path: "/appliedJobs",
        element: <AppliedJobs />,
      },
      {
        path: "/description/:id",
        element: <JobDescription />,
      },
      //for admin
      {
        path: "/admin/companies",
        element: <Companies />,
      },
      {
        path: "/admin/companies/create",
        element: <CompanyCreate />,
      },
      {
        path: "/admin/companies/:id",
        element: <CompanySetup />,
      },
      {
        path: "/admin/jobs",
        element: <JobByAdmin />,
      },
      {
        path: "/admin/jobs/create",
        element: <PostJobs />,
      },
      {
        path: "/admin/jobs/:id",
        element: <JobSetup />,
      },
      {
        path: "/admin/jobs/:id/applicants",
        element: <Applicants />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;