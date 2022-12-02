import React from'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import routes from "../routes";

const App = () => {
    return (
        <Router>
            {routes}
        </Router>
    )
}

ReactDOM.hydrateRoot(
    document.getElementById('root'), <App/>
);
