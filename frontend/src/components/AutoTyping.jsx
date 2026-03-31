import React, { useState, useEffect } from 'react';

const AutoType = ({ text, speed, pauseTime }) => {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [faded, setFaded] = useState(false);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(displayText + text[index]);
                setIndex(index + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
        // else {
        //     const resetTimeout = setTimeout(() => {
        //         setDisplayText("");
        //         setIndex(0);
        //     }, pauseTime);
        //     return () => clearTimeout(resetTimeout);
        // }
    }, [displayText, index, speed, text]);

    const handleClick = () => {
        setFaded(true);
    };

    return (
        <div 
            className={`font-mono transition-opacity duration-500 ease-in-out cursor-pointer ${faded ? "opacity-50" : "opacity-100"}`} 
            onClick={handleClick}
        >
            {displayText}
        </div>
    );
};

export default AutoType;