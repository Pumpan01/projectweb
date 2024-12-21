import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import BuildIcon from "@mui/icons-material/Build";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./HeaderAnimation.css";

const drawerWidth = 240;

function HomePage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const notifications = [
    "แจ้งเตือน: ค่าน้ำครบกำหนดชำระวันที่ 20/12/2024",
    "แจ้งเตือน: แจ้งซ่อมประตูห้อง 301 เรียบร้อยแล้ว",
    "แจ้งเตือน: ระบบจะปิดปรับปรุงในวันที่ 25/12/2024",
  ];

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    toast.success("ออกจากระบบสำเร็จ", {
      position: "top-center",
      autoClose: 1000,
    });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: "#f7f7f7",
        height: "100vh",
        borderRight: "1px solid #ddd",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff5722" }}>
          HorPlus
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate("/user")}>
          {" "}
          {/* ไปยัง user.js */}
          <GroupIcon sx={{ color: "#ff5722", marginRight: "8px" }} />
          <ListItemText primary="ข้อมูลผู้ใช้งาน" />
        </ListItem>
        <ListItem button>
          <BuildIcon sx={{ color: "#ff5722", marginRight: "8px" }} />
          <ListItemText primary="แจ้งซ่อม" />
        </ListItem>
        <ListItem button>
          <NotificationsActiveIcon
            sx={{ color: "#ff5722", marginRight: "8px" }}
          />
          <ListItemText primary="การแจ้งเตือน" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer />
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#ff5722" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h3"
            noWrap
            sx={{
              flexGrow: 1,
              textAlign: "center",
              overflow: "hidden", // ซ่อนข้อความที่เลื่อนออกไป
            }}
            className="glowing-text"
          >
            ระบบจัดการหอพัก HorPlus
          </Typography>

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              bgcolor: "#fff",
              color: "#ff5722",
              "&:hover": { bgcolor: "#ffe0b2" },
            }}
          >
            ออกจากระบบ
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, bgcolor: "#f9f9f9", minHeight: "100vh" }}
      >
        <Toolbar />
        <Grid container spacing={4}>
          {/* ข้อมูลผู้ใช้งาน */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ข้อมูลผู้ใช้งาน
              </Typography>
              <List>
                {users.map((user) => (
                  <ListItem key={user.user_id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#ff7043" }}>
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`ชื่อผู้ใช้: ${user.username}`}
                      secondary={`ชื่อเต็ม: ${
                        user.full_name || "N/A"
                      } | ห้อง: ${user.room_id || "N/A"}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default HomePage;
