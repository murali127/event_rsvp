import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, name);
    navigate("/verify-email");
  };

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
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <User size={18} style={{ marginRight: "0.5rem", color: "gray" }} />
              ),
            }}
            required
          />

          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <Mail size={18} style={{ marginRight: "0.5rem", color: "gray" }} />
              ),
            }}
            required
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <Lock size={18} style={{ marginRight: "0.5rem", color: "gray" }} />
              ),
            }}
            required
          />

          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              style={{ padding: "0.75rem" }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </Box>
  );
}
