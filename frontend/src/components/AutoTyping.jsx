import { textFieldClasses } from '@mui/material';
import {useState,useEffect} from 'react'

const AutoType=({text,speed,pauseTime})=>{
    const [displayText,setDisplayText]=useState("");
    const [index,setIndex]=useState(0);
    const [faded,setFaded]=useState(false);

    useEffect(()=>{
        if(index < text.length){
            const timeout=setTimeout(()=>{
                setDisplayText(displayText + text[index]);
                setIndex(index + 1)
            },speed);
            return ()=>clearTimeout(timeout);
          }//else{
        //      const resetTimeout=setTimeout(()=>{
        //      setDisplayText("")
        //          setIndex(0);
        //      },pauseTime);

        //     return ()=>clearTimeout(resetTimeout);
        //  }

    },[displayText,index,speed,text]);

    const handleClick=()=>{
        setFaded(true);
    }
    return(
        <div className={`typing-text ${faded ? "faded": ""}`} onClick={handleClick}>
        {displayText}
        </div>
    )
}

export default AutoType;