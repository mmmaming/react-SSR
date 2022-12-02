import React from 'react';
import { Link } from "react-router-dom";

const HomePage = () => {
    const handleClick = () => {
        console.log('oh, you clicked me');
    }

    return (
        <div>
            <h2>
                HomePage
            </h2>
            <button onClick={handleClick}>click me</button>
            <div>
                <Link to="/park">Go to Park</Link>
            </div>
        </div>
    )
};

export default HomePage;
