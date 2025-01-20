import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText, // เพิ่มการ import นี้
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group"; // เพิ่มสำหรับไอคอนในเมนู
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

function RepairPage() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    repair_id: "",
    status: "pending",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // สำหรับเปิดปิด Sidebar

  const navigate = useNavigate();

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/api/repairs?is_admin=true"
      );
      if (response.ok) {
        const data = await response.json();
        setRepairs(data || []);
      } else {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching repairs:", error);
      toast.error("เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (repair = null) => {
    setFormData(
      repair || {
        repair_id: "",
        status: "pending",
      }
    );
    setIsEditing(!!repair);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleUpdateRepair = async () => {
    if (!formData.status) {
      toast.error("กรุณาเลือกสถานะ");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/repairs/${formData.repair_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: formData.status, // ส่งแค่สถานะที่เลือก
          }),
        }
      );

      if (response.ok) {
        toast.success("อัปเดตสถานะการแจ้งซ่อมสำเร็จ");
        fetchRepairs(); // โหลดข้อมูลใหม่
        handleCloseDialog(); // ปิด Dialog
      } else {
        const errorData = await response.json();
        toast.error(
          `เกิดข้อผิดพลาด: ${errorData.error || "บันทึกข้อมูลล้มเหลว"}`
        );
      }
    } catch (error) {
      console.error("Error updating repair:", error);
      toast.error("บันทึกข้อมูลล้มเหลว");
    }
  };

  const handleDeleteRepair = async (repair_id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/repairs/${repair_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("ลบข้อมูลสำเร็จ");
        fetchRepairs();
      } else {
        toast.error("ลบข้อมูลล้มเหลว");
      }
    } catch (error) {
      console.error("Error deleting repair:", error);
      toast.error("ลบข้อมูลล้มเหลว");
    }
  };

  return (
    <>
      {/* Drawer for Sidebar */}
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

      {/* AppBar with IconButton for opening Sidebar */}
      <AppBar position="sticky" sx={{ bgcolor: "#ff5722" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon  />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
            การแจ้งซ่อม
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <ToastContainer />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={6}>
              {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>รหัสห้อง</TableCell>
                      <TableCell>คำอธิบาย</TableCell>
                      <TableCell>สถานะ</TableCell>
                      <TableCell>วันที่แจ้ง</TableCell>
                      <TableCell>การตอบกลับ</TableCell>
                      <TableCell align="right">การกระทำ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {repairs.map((repair) => (
                      <TableRow key={repair.repair_id}>
                        <TableCell>{repair.repair_id}</TableCell>
                        <TableCell>{repair.room_id || "ไม่มีข้อมูล"}</TableCell>
                        <TableCell>{repair.description}</TableCell>
                        <TableCell>{repair.status}</TableCell>
                        <TableCell>
                          {new Date(repair.repair_date).toLocaleString("th-TH")}
                        </TableCell>
                        <TableCell>{repair.response || "รอตอบกลับ"}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="แก้ไข">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenDialog(repair)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="ลบ">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDeleteRepair(repair.repair_id)
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

        {/* Dialog for updating status */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? "อัปเดตสถานะการแจ้งซ่อม" : "แจ้งซ่อมใหม่"}
          </DialogTitle>
          <DialogContent>
            <Select
              name="status"
              fullWidth
              value={formData.status || ""}
              onChange={handleChange}
              sx={{ mt: 2 }}
            >
              <MenuItem value="pending">รอรับเรื่อง</MenuItem>
              <MenuItem value="in progress">กำลังดำเนินการ</MenuItem>
              <MenuItem value="complete">เสร็จสิ้น</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>ยกเลิก</Button>
            <Button onClick={handleUpdateRepair}>บันทึก</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default RepairPage;
