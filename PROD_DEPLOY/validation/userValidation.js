// Utility functions to validate the inputs

// Email Validation
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

// Password Validation
const validatePassword = (password) => {
    // Example criteria: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

module.exports = { validateEmail, validatePassword };
