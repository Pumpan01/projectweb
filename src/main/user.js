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
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    user_id: "",
    username: "",
    password: "",
    full_name: "",
    phone_number: "",
    line_id: "",
    room_id: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/users");
      const data = await response.json();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setFormData(user);
      setIsEditing(true);
    } else {
      setFormData({
        user_id: "",
        username: "",
        password: "",
        full_name: "",
        phone_number: "",
        line_id: "",
        room_id: "",
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveUser = async () => {
    if (!formData.username || (!isEditing && !formData.password)) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const sanitizedFormData = {
      ...formData,
      room_id: formData.room_id ? parseInt(formData.room_id) : null,
      full_name: formData.full_name || null,
      phone_number: formData.phone_number || null,
      line_id: formData.line_id || null,
    };

    try {
      const url = isEditing
        ? `http://localhost:4000/api/users/${formData.user_id}`
        : "http://localhost:4000/api/register";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedFormData),
      });

      if (response.ok) {
        toast.success(isEditing ? "แก้ไขข้อมูลสำเร็จ" : "เพิ่มผู้ใช้สำเร็จ", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchUsers();
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "เกิดข้อผิดพลาด", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleOpenDeleteDialog = (user_id) => {
    setSelectedUserId(user_id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${selectedUserId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.success("ลบผู้ใช้สำเร็จ", {
          position: "top-center",
          autoClose: 2000,
        });
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "เกิดข้อผิดพลาดในการลบผู้ใช้", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("เกิดข้อผิดพลาดในการลบผู้ใช้", {
        position: "top-center",
        autoClose: 2000,
      });
    }
    handleCloseDeleteDialog();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <ToastContainer />
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#ff5722",
          textShadow: "2px 2px 5px #ffe0b2",
        }}
      >
        จัดการผู้ใช้งาน
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
          เพิ่มผู้ใช้
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 2 }}>
        {loading ? (
          <CircularProgress
            sx={{ display: "block", margin: "20px auto" }}
            color="primary"
          />
        ) : (
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#ff5722",
                "& th": { color: "white", fontWeight: "bold" },
              }}
            >
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ชื่อผู้ใช้</TableCell>
                <TableCell>ชื่อเต็ม</TableCell>
                <TableCell>เบอร์โทร</TableCell>
                <TableCell>Line ID</TableCell>
                <TableCell>Room ID</TableCell>
                <TableCell align="right">การกระทำ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.user_id}
                  sx={{
                    "&:hover": { backgroundColor: "#ffe0b2" },
                    transition: "0.3s",
                  }}
                >
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.line_id}</TableCell>
                  <TableCell>{user.room_id}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="แก้ไข">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="ลบ">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(user.user_id)}
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

      {/* Dialog เพิ่ม/แก้ไข */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {isEditing ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="ชื่อผู้ใช้"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username || ""}
            onChange={handleChange}
          />
          {!isEditing && (
            <TextField
              label="รหัสผ่าน"
              type="password"
              name="password"
              fullWidth
              margin="normal"
              value={formData.password || ""}
              onChange={handleChange}
            />
          )}
          <TextField
            label="ชื่อเต็ม"
            name="full_name"
            fullWidth
            margin="normal"
            value={formData.full_name || ""}
            onChange={handleChange}
          />
          <TextField
            label="เบอร์โทร"
            name="phone_number"
            fullWidth
            margin="normal"
            value={formData.phone_number || ""}
            onChange={handleChange}
          />
          <TextField
            label="Line ID"
            name="line_id"
            fullWidth
            margin="normal"
            value={formData.line_id || ""}
            onChange={handleChange}
          />
          <TextField
            label="Room ID"
            name="room_id"
            type="number"
            fullWidth
            margin="normal"
            value={formData.room_id || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleSaveUser}>บันทึก</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog ลบ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
      >
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>ยกเลิก</Button>
          <Button onClick={handleDeleteUser}>ลบ</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserManagement;
