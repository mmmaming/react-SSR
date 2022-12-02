import React from 'react';
import { Route } from "react-router-dom";
import { Routes } from "react-router";
import HomePage from "./container/HomePage";
import Park from "./container/Park";

export default (
    <div>
        <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/park" element={<Park />} />
        </Routes>
    </div>
)
