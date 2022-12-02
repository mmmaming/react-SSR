import React from'react';
import ReactDOM from 'react-dom/client';
import HomePage from "../container/HomePage";

const App = () => {
    return (
        <HomePage />
    )
}

ReactDOM.hydrateRoot(
    document.getElementById('root'), <App/>
);
