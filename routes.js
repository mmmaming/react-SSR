import React from 'react';
import HomePage, {fetchServerData} from "./container/HomePage";
import Park from "./container/Park";

export default [
    {
        path: "/",
        element: HomePage,
        loadData: fetchServerData,
        exact: true,
        key: "homepage"
    },
    {
        path: "/park",
        element: Park,
        exact: true,
        key: "park"
    }
]

