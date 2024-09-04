import { Toaster } from "@/components/ui/toaster";
import store from "@/store/store";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <Toaster />
            <App />
        </Provider>
    </React.StrictMode>
);
