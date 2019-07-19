import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Main } from "./web/web-main";
import { AppDetails } from "./web/app-details";

const target = document.getElementById("react-root");
if (!target) {
  throw new Error("Failed to find root");
}

const args: string[] = (window as any).process.argv;
const appid = args.find(a => a.includes("--appid="));

if (appid) {
  ReactDOM.render(
    <AppDetails appid={parseInt(appid.replace("--appid=", ""))} />,
    document.getElementById("react-root")
  );
} else {
  ReactDOM.render(<Main />, document.getElementById("react-root"));
}
