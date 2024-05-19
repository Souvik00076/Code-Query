import React from "react";
import ReactDOM from "react-dom/client"; // Fix the import statement
import App from "./App";
import "./styles.scss";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
