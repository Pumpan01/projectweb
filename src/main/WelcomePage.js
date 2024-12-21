import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from "../Pictures/logohorplus.png";
import LoginIcon from "@mui/icons-material/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Keyframe Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const dialogAnimation = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

function WelcomePage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน", {
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("เข้าสู่ระบบสำเร็จ", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => navigate("/home"), 1000);
      } else {
        toast.error(result.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("เกิดปัญหาในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองอีกครั้ง", {
        position: "top-center",
        autoClose: 1000,
      });
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #e0e0e0, #ff7043)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: "url(https://source.unsplash.com/random/1920x1080)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px)",
          opacity: 0.4,
          zIndex: -1,
        }}
      />

      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          padding: { xs: "15px 20px", sm: "20px 40px" },
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="HorPlus Logo"
          sx={{
            width: { xs: "60px", sm: "80px", md: "100px", lg: "120px" },
            marginBottom: "20px",
          }}
        />

        <Typography
          variant="h3"
          sx={{
            color: "#ff5722",
            fontWeight: "bold",
            letterSpacing: "2px",
            marginBottom: "10px",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
          }}
        >
          HORPLUS
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpenLogin}
          sx={{
            backgroundColor: "#ff5722",
            color: "#fff",
            fontWeight: "bold",
            mt: 2,
          }}
        >
          เข้าสู่ระบบ
        </Button>
      </Container>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={handleCloseLogin}>
        <DialogTitle>เข้าสู่ระบบ</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogin} disabled={loading}>
            ยกเลิก
          </Button>
          <Button onClick={handleLogin} variant="contained" disabled={loading}>
            {loading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WelcomePage;
