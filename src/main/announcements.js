import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    announcement_id: "",
    title: "",
    detail: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/announcements");
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data || []);
      } else {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (announcement = null) => {
    if (announcement) {
      setFormData(announcement);
      setIsEditing(true);
    } else {
      setFormData({
        announcement_id: "",
        title: "",
        detail: "",
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveAnnouncement = async () => {
    if (!formData.title || !formData.detail) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:4000/api/announcements/${formData.announcement_id}`
        : "http://localhost:4000/api/announcements";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          isEditing ? "แก้ไขประกาศสำเร็จ" : "เพิ่มประกาศสำเร็จ",
          {
            position: "top-center",
            autoClose: 2000,
          }
        );
        fetchAnnouncements();
        handleCloseDialog();
      } else {
        toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteAnnouncement = async (announcement_id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/announcements/${announcement_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("ลบประกาศสำเร็จ", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchAnnouncements();
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบข้อมูล", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            เมนูหลัก
          </Typography>
          <List>
            <ListItem button onClick={() => navigate("/home")}>
              <GroupIcon sx={{ marginRight: 1 }} />
              <ListItemText primary="หน้าหลัก" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <AppBar position="sticky" sx={{ bgcolor: "#ff5722" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h3"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontSize: { xs: "20px", sm: "30px", md: "40px", lg: "50px" },
            }}
          >
            ประกาศ
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ToastContainer />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(45deg, #ff7043, #ff5722)",
              "&:hover": {
                background: "linear-gradient(45deg, #ff5722, #e64a19)",
              },
              transition: "0.3s",
            }}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มประกาศใหม่
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer
              component={Paper}
              elevation={6}
              sx={{ borderRadius: 2 }}
            >
              {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
              ) : (
                <Table>
                  <TableHead
                    sx={{
                      backgroundColor: "#ff5722",
                      "& th": {
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      },
                    }}
                  >
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>หัวข้อ</TableCell>
                      <TableCell>รายละเอียด</TableCell>
                      <TableCell align="right">การกระทำ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow key={announcement.announcement_id}>
                        <TableCell>{announcement.announcement_id}</TableCell>
                        <TableCell>{announcement.title}</TableCell>
                        <TableCell>{announcement.detail}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="แก้ไข">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(announcement)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="ลบ">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDeleteAnnouncement(
                                  announcement.announcement_id
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Grid>
        </Grid>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            {isEditing ? "แก้ไขประกาศ" : "เพิ่มประกาศใหม่"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="หัวข้อ"
              name="title"
              fullWidth
              margin="normal"
              value={formData.title || ""}
              onChange={handleChange}
            />
            <TextField
              label="รายละเอียด"
              name="detail"
              fullWidth
              margin="normal"
              value={formData.detail || ""}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>ยกเลิก</Button>
            <Button onClick={handleSaveAnnouncement}>บันทึก</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default Announcements;
