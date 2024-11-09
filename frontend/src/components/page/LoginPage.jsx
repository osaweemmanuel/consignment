import { Typography, Box, Grid, TextField, Button, InputAdornment } from "@mui/material";
import { useState, useEffect } from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/auth/userApiSlice";
import { setCredentials } from "../../features/auth/authSlice";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState(""); // For any general errors

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const userInfo = useSelector((state) => state.auth.userInfo);


    useEffect(() => {
        if (userInfo) {
            navigate("/admin/dashboard");
        }
    }, [navigate, userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");
        setGeneralError(""); // Reset general error

        try {
            const resp = await login({ email, password }).unwrap(); // Correct argument structure
          
            dispatch(setCredentials({ 
               userInfo:resp.user,
               token:resp.token,
               refreshToken:resp.refreshToken
            }));
            setEmail(""); // Clear input fields on success
            setPassword("");
            navigate("/admin/dashboard");
        } catch (err) {
            // Ensure that message is a string
            const message = err?.data?.message || err.error || "An unknown error occurred."; // Default message

            // Check if message is a string before using includes
            if (typeof message === 'string') {
                if (message.includes("email")) {
                    setEmailError("Invalid email");
                } else if (message.includes('password')) {
                    setPasswordError("Invalid password");
                } else {
                    setGeneralError("An unexpected error occurred. Please try again."); // Handle unexpected errors
                }
            } else {
                setGeneralError("An unexpected error occurred. Please try again."); // Handle unexpected errors
            }
        }
    };

    const handleShowPassword = () => setShowPassword((prev) => !prev);

    return (
        <Grid container spacing={2} sx={{ height: '100vh', backgroundColor: 'rgb(249, 23, 81)' }}>
            <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto' }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit} // Attach submit handler here
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography variant="h4" sx={{ textAlign: 'center', mt: 2, color: 'rgb(249, 23, 81)' }}>
                        <LocalShippingIcon sx={{ fontSize: 40 }} />
                    </Typography>

                    <Typography variant='body1' sx={{ textAlign: 'center', mt: 2, fontSize: '18px' }}>
                        Login
                    </Typography>

                    {generalError && <Typography color="error" sx={{ textAlign: 'center' }}>{generalError}</Typography>} {/* Display general error */}

                    <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        name="email"
                        error={!!emailError}
                        helperText={emailError}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Handle input changes
                        margin="normal"
                        sx={{ mt: 4 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        error={!!passwordError}
                        helperText={passwordError}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Handle input changes
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
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

                    <Button
                        variant="contained"
                        fullWidth
                        type="submit" // Button type should be submit
                        sx={{
                            mt: 3,
                            backgroundColor: 'rgb(249, 23, 81)',
                            '&:hover': {
                                backgroundColor: 'rgb(200, 19, 65)',
                            },
                            color: 'white',
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LoginPage;
