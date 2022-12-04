import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
    const [ state, setState ] = useState(null);
    const handleClick = () => {
        console.log('oh, you clicked me');
    }


    useEffect(() => {
        axios.get("https://api.apiopen.top/api/getHaoKanVideo?page=0&size=2").then(res => {
            setState(res?.data?.result?.list)
        })
    }, []);
    return (
        <div>
            <h2>
                HomePage
            </h2>
            <button onClick={handleClick}>click me</button>
            <div>
                <Link to="/park">Go to Park</Link>
            </div>
            <h3>
                here is some video
            </h3>
            <ul>
                {
                    state && state.map(item => <li key={item.id}>{item.title}</li>)
                }
            </ul>

        </div>
    )
};

export default HomePage;
