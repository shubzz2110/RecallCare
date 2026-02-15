import { createBrowserRouter } from "react-router";
import Dashboard from "./routes/dashboard/Dashboard";
import Protected from "./layouts/Protected";
import Appointments from "./routes/appointments/Appointments";
import Patients from "./routes/patients/Patients";
import Settings from "./routes/settings/Settings";
import Clinics from "./routes/internal/Clinics";
import InternalLayout from "./layouts/Internal";
import RootLayout from "./layouts/Root";
import HomeRedirect from "./routes/Home";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: "login",
        lazy: () =>
          import("./routes/auth/Login").then((module) => ({
            element: <module.default />,
          })),
      },
      {
        element: <Protected />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "patients",
            element: <Patients />,
          },
          {
            path: "appointments",
            element: <Appointments />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
      {
        path: "internal",
        element: <InternalLayout />,
        children: [
          {
            path: "clinics",
            element: <Clinics />,
          },
        ],
      },
    ],
  },
]);

export default AppRoutes;
