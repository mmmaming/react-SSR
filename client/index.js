import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router";
import routes from "../routes";

const App = () => {
    return (
        <Router>
            <Routes>
                {routes.map(route => {
                    const Component = route.element;
                    return (
                        <Route {...route} element={<Component />}/>
                    )
                })}
            </Routes>
        </Router>
    )
}

ReactDOM.hydrateRoot(
    document.getElementById('root'), <App/>
);
