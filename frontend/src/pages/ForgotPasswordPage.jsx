import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { Input } from "@/components/ui/input"; // Ensure this Input is an MUI component
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/store/authStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword, message, isLoading } = useAuthStore();
  
  async function onSubmit(e) {
    e.preventDefault();
    await forgotPassword(email);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "400px",
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Enter your email to reset your password.
        </Typography>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={{
              padding: "0.75rem",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          />

          {message && (
            <Typography variant="body2" color="success" align="center">
              {message}
            </Typography>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ padding: "0.75rem" }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </Button>
          </motion.div>
        </form>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <Button variant="link" sx={{ padding: "0", textDecoration: "underline" }}>
            Back to Login
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
