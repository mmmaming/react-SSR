import React from 'react';
import { Route } from "react-router-dom";
import { Routes } from "react-router";
import HomePage from "./container/HomePage";

export default (
    <div>
        <Routes>
            <Route exact path="/" element={<HomePage />} />
        </Routes>
    </div>
)
