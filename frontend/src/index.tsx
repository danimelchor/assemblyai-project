import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { MantineProvider } from "@mantine/core";
import axios from "axios";
import Router from "./components/Router";
import { HashRouter } from "react-router-dom";

import "./index.css";

axios.defaults.baseURL = "http://127.0.0.1:5001";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                primaryColor: "orange",
            }}
        >
            <HashRouter>
                <Router />
            </HashRouter>
        </MantineProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
