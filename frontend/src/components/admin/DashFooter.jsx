import { Box, Typography } from "@mui/material"

const DashFooter=()=>{
    const currentYear=new Date().getFullYear();
    return(
        <Box sx={{backgroundColor:'white'}}>
            <Typography variant="body1" sx={{color:'gray',textAlign:'center',mt:6}}> Copyright &copy; {currentYear} Courier Admin </Typography>
        </Box>
    )
}

export default DashFooter;