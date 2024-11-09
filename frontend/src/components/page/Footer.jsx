import { Box, Typography } from "@mui/material"

const Footer=()=>{
    const currentYear=new Date().getFullYear();
    return(
        <Box sx={{textAlign:'center',mt: 3,mb:3, fontSize:{xs:'10px', sm:'12px'}}}>
            <Typography >&copy; {currentYear} Your Company Name. All rights reserved.</Typography>
        </Box>
    )
}

export default Footer;