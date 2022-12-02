import React from 'react';

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
        </div>
    )
};

export default HomePage;
