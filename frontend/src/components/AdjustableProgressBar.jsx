// import { LinearProgress,Box, Typography } from "@mui/material";
// import { useState,useEffect } from "react";

// const AdjustableProgressBar=()=>{
//     const [progress,setProgress]=useState(0);

//     useEffect(()=>{
//       const newProgress=Math.max(0,Math.min(100,progressStatus));
//          // Update the progress state whenever the progressStatus prop changes
//       setProgress(newProgress);
//     },[progressStatus])
//     return(
//     <Box sx={{ width:'80%', padding: 1, position: 'relative',margin: '0 auto', }}>
//         <LinearProgress variant="determinate" value={progress} sx={{ height: 17 }} />
//         <Typography variant="body1" sx={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',fontWeight:'bold'}}>
//           {progress}%
//         </Typography>
      
//       </Box>
//     )
// }

// export default AdjustableProgressBar;


import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const AdjustableProgressBar = ({ progressStatus }) => {
    const [progress, setProgress] = useState(0);

    // Update the progress state whenever the progressStatus prop changes
    useEffect(() => {
        // Ensure progress is between 0 and 100
        const newProgress = Math.max(0, Math.min(100, progressStatus));
        setProgress(newProgress);
    }, [progressStatus]);

    return (
        <Box sx={{ width: '80%', padding: 1, position: 'relative', margin: '0 auto' }}>
       
            <LinearProgress variant="determinate" value={progress} sx={{ height: 17 }} />
            <Typography 
                variant="body1" 
                sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontWeight: 'bold'
                }}
            >
                {progress}%
            </Typography>
        </Box>
    );
}

export default AdjustableProgressBar;

