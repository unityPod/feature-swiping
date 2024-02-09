import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

let App = function MyApp(){

    return(
        <div>
            hello world
        </div>
    )
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>)