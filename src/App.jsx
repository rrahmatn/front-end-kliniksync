import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./page/dashboard";
import Admin from "./page/admin";
import "./App.css";
import Auth from "./page/auth";
import Receptionist from "./page/receptionist";
import Doctor from "./page/doctor"
import Pharmacy from "./page/pharmacy";
import Cashier from "./page/cashier"
import { useEffect } from "react";
import refreshAccessToken from "./auth";
import SuperAdmin from "./page/superAdmin";


const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path: "/receptionist",
      element: <Receptionist/>,
    },
    {
      path: "/doctor",
      element: <Doctor />,
    },
    {
      path: "/pharmacy",
      element: <Pharmacy />,
    },
    {
      path: "/cashier",
      element: <Cashier />,
    },
    {
      path: "/superadmin",
      element: <SuperAdmin />,
    }
  ]);
 

  return (
    <>
      <main className="app text">
        <RouterProvider router={router} />
      </main>
    </>
  );
};

export default App;
