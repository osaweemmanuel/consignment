const { body, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        try {
            // Run all validations
            for (const validation of validations) {
                await validation.run(req);
            }

            // Collect validation errors
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                return next(); // Proceed if no errors
            }

            // Send error response
            return res.status(400).json({ errors: errors.array() });
        } catch (error) {
            // Handle any errors that occur during validation
            console.error('Validation Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

const signupValidation = () => {
    return [
        body('firstname').notEmpty().withMessage("Firstname is required"),
        body('lastname').notEmpty().withMessage("Lastname is required"),
        body('gender').notEmpty().withMessage("Gender is required"),
        body('email').isEmail().withMessage("Enter a valid email"),
        body('password')
            .isLength({ min: 6 }) // Ensure password has at least 6 characters
            .withMessage("Password must be at least 6 characters"),
    ];
};

const loginValidation = () => {
    return [
        body('email').isEmail().withMessage("Enter a valid email"),
        body('password')
            .isLength({ min: 6 }) // Ensure password has at least 6 characters
            .withMessage("Password must be at least 6 characters"),
    ];
};

module.exports = { validate, signupValidation, loginValidation };
