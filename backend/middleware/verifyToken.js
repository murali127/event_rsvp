import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Retrieve the token from cookies
    const token = req.cookies.token;

    // If no token is found, respond with unauthorized status
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, token missing"
        });
    }

    try {
        // Verify the token using the JWT secret from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store the decoded userId in the request object for use in later middleware
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Catch any errors, e.g., token expiration or invalid token
        console.error(error);  // Log the error for debugging (be cautious with production logging)
        return res.status(401).json({
            success: false,
            message: "Unauthorized, invalid token"
        });
    }
};
