import { Box, TextField, Typography, Button, Grid, InputAdornment } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock"; // Import Lock icon
import { useChangePasswordMutation } from "../../features/auth/userApiSlice";
import { useState } from "react";


const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);

  const [changePassword] = useChangePasswordMutation();


  const handleSubmit = async (e) => {
 
    e.preventDefault();
    setFormError({});

    if (!oldPassword || !newPassword) {
      setFormError({ message: "All fields are required" });
      return;
    }
    setLoading(true);

    try {
      const response=await changePassword({ oldPassword, newPassword }).unwrap();
      console.log(response);
      setSuccessMessage(true);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setFormError({ message: error?.data?.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const style = {
    width: "90%",
    maxWidth: 500,
    margin: "0 auto",
    padding: "2rem",
    bgcolor: "background.paper",
    boxShadow: 24,

  };

  return (
    <Box sx={style}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Change Password</Typography>
      </Box>
      <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
        <Grid item xs={12}>
          <TextField
            label="Old Password"
            name="oldPassword"
            type="password"
            fullWidth
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            error={!!formError.message}
            helperText={formError.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" color="primary" variant="contained" disabled={loading}>
            {loading ? "Changing..." : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;
