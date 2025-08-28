import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { worker } from "./mocks/browser";

async function prepare() {
  // if (import.meta.env.DEV) {
  //   return worker.start()
  // }
  return worker.start()
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <App/>
  );
});
