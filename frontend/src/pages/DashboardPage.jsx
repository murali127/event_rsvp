import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthStore } from '@/store/authStore';

const DashboardPage = () => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="h6" color="error">
          User not found. Please log in.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          width: '400px',
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body2" align="center">
          Your email is {user.email}.
        </Typography>
      </motion.div>
    </Box>
  );
};

export default DashboardPage;
