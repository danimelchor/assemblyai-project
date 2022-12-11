import { Outlet, useRoutes } from "react-router-dom";
import { AuthProvider } from "../middlewares/authentication";

import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Processing from "../pages/Processing";
import Register from "../pages/Register";
import Search from "../pages/Search";
import Upload from "../pages/Upload";
import Video from "../pages/Video";
import Navbar from "./Navbar";

const Router = () => {
    const routes = [
        {
            path: "/",
            element: (
                <AuthProvider>
                    <Navbar />
                    <Outlet />
                </AuthProvider>
            ),
            children: [
                {
                    path: "",
                    element: <Home />,
                },
                {
                    path: "video/:id",
                    element: <Video />,
                },
                {
                    path: "upload",
                    element: <Upload />,
                },
                {
                    path: "search",
                    element: <Search />,
                },
                {
                    path: "login",
                    element: <Login />,
                },
                {
                    path: "register",
                    element: <Register />,
                },
                {
                    path: "processing",
                    element: <Processing />,
                },
                {
                    path: "*",
                    element: <NotFound />,
                },
            ],
        },
    ];
    let element = useRoutes(routes);

    return element;
};

export default Router;
