// import { Typography, Box, Grid, TextField, Button, InputAdornment, MenuItem, FormControl, Select, InputLabel, Snackbar, Alert } from "@mui/material";
// import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { useRegisterMutation } from "../../features/auth/userApiSlice";
// import PersonIcon from '@mui/icons-material/Person';
// import EmailIcon from '@mui/icons-material/Email';
// import IconButton from '@mui/material/IconButton';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const RegisterPage = () => {
//     const [firstname, setFirstname] = useState("");
//     const [lastname, setLastname] = useState("");
//     const [gender, setGender] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const [emailError, setEmailError] = useState("");
//     const [passwordError, setPasswordError] = useState("");
//     const [confirmPasswordError, setConfirmPasswordError] = useState("");

//     const [errorMessage, setErrorMessage] = useState(""); // For general errors
//     const [successMessage, setSuccessMessage] = useState(""); // For success message

//     const [openSnackbar, setOpenSnackbar] = useState(false); // To control Snackbar visibility

//     const navigate = useNavigate();
  

//     const [register, { isLoading }] = useRegisterMutation();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setEmailError("");
//         setPasswordError("");
//         setConfirmPasswordError("");
//         setErrorMessage("");
//         setSuccessMessage("");

//         // Basic form validation
//         if (!firstname || !lastname || !gender || !email || !password || !confirmPassword) {
//             setErrorMessage("All fields are required!");
//             setOpenSnackbar(true);
//             return;
//         }
//         if (password !== confirmPassword) {
//             setConfirmPasswordError("Passwords do not match!");
//             return;
//         }

//         try {
//             const resp = await register({ firstname, lastname, gender, email, password }).unwrap();
//             setSuccessMessage("Registration successful! Redirecting to login page...");
//             setOpenSnackbar(true);

//             // Clear form after successful registration
//             setFirstname("");
//             setLastname("");
//             setGender("");
//             setEmail("");
//             setPassword("");
//             setConfirmPassword("");

//             setTimeout(() => {
//                 navigate("/login");
//             }, 3000); // Navigate to login after 3 seconds
//         } catch (err) {
//             const message = err?.data?.message || err.error;
//             if (message.includes("email")) setEmailError("Invalid email");
//             if (message.includes("password")) setPasswordError("Invalid password");

//             setErrorMessage(message || "Registration failed!");
//             setOpenSnackbar(true);
//         }
//     };

//     const handleShowPassword = () => setShowPassword((prev) => !prev);
//     const handleCloseSnackbar = () => setOpenSnackbar(false); // Close Snackbar on timeout or manually

//     return (
//         <Grid container spacing={2} sx={{ height: '100vh', backgroundColor: 'rgb(249, 23, 81)' }}>
//             <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                 <Box
//                     component="form"
//                     onSubmit={handleSubmit}
//                     sx={{
//                         width: '100%',
//                         maxWidth: 400,
//                         backgroundColor: 'white',
//                         padding: 4,
//                         borderRadius: 2,
//                         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//                     }}
//                 >
//                     <Typography variant="h4" sx={{ textAlign: 'center', color: 'rgb(249, 23, 81)' }}>
//                         Register
//                     </Typography>

//                     {/* First Name */}
//                     <TextField
//                         fullWidth
//                         label="First Name"
//                         value={firstname}
//                         onChange={(e) => setFirstname(e.target.value)}
//                         margin="normal"
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <PersonIcon />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />

//                     {/* Last Name */}
//                     <TextField
//                         fullWidth
//                         label="Last Name"
//                         value={lastname}
//                         onChange={(e) => setLastname(e.target.value)}
//                         margin="normal"
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <PersonIcon />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />

//                     {/* Email */}
//                     <TextField
//                         fullWidth
//                         type="email"
//                         label="Email"
//                         error={!!emailError}
//                         helperText={emailError}
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         margin="normal"
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <EmailIcon />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />

//                     {/* Gender */}
//                     <FormControl fullWidth margin="normal">
//                         <InputLabel>Gender</InputLabel>
//                         <Select
//                             value={gender}
//                             onChange={(e) => setGender(e.target.value)}
//                             label="Gender"
//                         >
//                             <MenuItem value=""><em>Select Gender</em></MenuItem>
//                             <MenuItem value="male">Male</MenuItem>
//                             <MenuItem value="female">Female</MenuItem>
//                             <MenuItem value="others">Others</MenuItem>
//                         </Select>
//                     </FormControl>

//                     {/* Password */}
//                     <TextField
//                         fullWidth
//                         name="password"
//                         label="Password"
//                         error={!!passwordError}
//                         helperText={passwordError}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         type={showPassword ? 'text' : 'password'}
//                         margin="normal"
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <IconButton aria-label="toggle password visibility" onClick={handleShowPassword}>
//                                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                                     </IconButton>
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />

//                     {/* Confirm Password */}
//                     <TextField
//                         fullWidth
//                         name="confirmPassword"
//                         label="Confirm Password"
//                         error={!!confirmPasswordError}
//                         helperText={confirmPasswordError}
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         type="password"
//                         margin="normal"
//                     />

//                     {/* Submit Button */}
//                     <Button
//                         variant="contained"
//                         fullWidth
//                         type="submit"
//                         sx={{
//                             mt: 3,
//                             backgroundColor: 'rgb(249, 23, 81)',
//                             '&:hover': {
//                                 backgroundColor: 'rgb(200, 19, 65)',
//                             },
//                             color: 'white',
//                         }}
//                         disabled={isLoading}
//                     >
//                         {isLoading ? 'Registering...' : 'Register'}
//                     </Button>

//                     {/* Snackbar for Error/Success Messages */}
//                     <Snackbar
//                         open={openSnackbar}
//                         autoHideDuration={3000}
//                         onClose={handleCloseSnackbar}
//                         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//                     >
//                         <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"}>
//                             {successMessage || errorMessage}
//                         </Alert>
//                     </Snackbar>
//                 </Box>
//             </Grid>
//         </Grid>
//     );
// };

// export default RegisterPage;



import { useState } from "react";
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography,Snackbar,Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRegisterMutation } from "../../features/auth/userApiSlice";


const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [firstnameError,setFirstnameError]=useState("");
    const [lastnameError,setLastnameError]=useState("");
    const [emailError,setEmailError]=useState("");
    const [passwordError,setPasswordError]=useState("");
    const [confirmPasswordError,setConfirmPasswordError]=useState("");

   const [errorMessage,setErrorMessage]=useState(""); //general error
   const [successMessage,setSuccessMessage]=useState("");

   const [openSnackbar,setOpenSnackbar]=useState(false); //to control visibility

    const [register, { isLoading }] = useRegisterMutation();
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setFirstnameError("");
        setLastnameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setErrorMessage("");
        setSuccessMessage("");

          // Basic form validation
          if (!firstname || !lastname || !gender || !email || !password || !confirmPassword) {
            setErrorMessage("All fields are required!");
            setOpenSnackbar(true);
            return;
          }

          if(password !== confirmPassword){
             setConfirmPassword("Password does not match");
             return;
          }

          try{
                await register({firstname,lastname,gender,email,password}).unwrap();
                setSuccessMessage("Successfully registered...");
                setOpenSnackbar(true);

                //clear all register successful form
                setFirstname("");
                setLastname("");
                setGender("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                setTimeout(()=>{
                    navigate("/login");
                },2000)
          }catch(err){
            const message=err?.data?.message || err.error;
            if(message.includes("email")) setEmailError("Invalid Email");
            if(message.includes("password")) setPassword("Invalid Password");

            setErrorMessage(message || "Registration failed!");
            setOpenSnackbar(true);

          }
    
    }
 


    const handleShowPassword = () => setShowPassword((prev) => !prev);
    const handleCloseSnackbar=()=> setOpenSnackbar((prev)=>!prev);

    return (
        <Box
            sx={{
                pt: 8,
                mt: 12,
                maxWidth: '600px',
                width: '90%',
                margin: 'auto',
                padding: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 4,
                boxShadow: 3,
                backdropFilter: 'blur(5px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Typography variant="h4" sx={{ mt: 8, color: 'skyblue' }} gutterBottom>
                Registration Form
            </Typography>



                     {/* Snackbar for Error/Success Messages */}
                     <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"}>
                            {successMessage || errorMessage}
                        </Alert>
                    </Snackbar>



            <TextField
                type="text"
                label="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                error={!!firstnameError}
                helperText={firstnameError}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <PersonIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                type="text"
                label="Last Name"
                value={lastname}
                error={!!lastnameError}
                helperText={lastnameError}
                onChange={(e) => setLastname(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <PersonIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                type="email"
                label="Email"
                value={email}
                error={!!emailError}
                helperText={emailError}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <EmailIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Gender"
                >
                    <MenuItem value=""><em>Select Gender</em></MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                </Select>
            </FormControl>

            <TextField
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                error={!!passwordError}
                helperText={passwordError}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" onClick={handleShowPassword}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />

    

            <Button variant="contained" onClick={handleSubmit} fullWidth disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
            </Button>
        </Box>
    );
};

export default RegisterPage;
