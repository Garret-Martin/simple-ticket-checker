import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";

const fetchUsers = async (query, page, limit) => {
  try {
    const response = await fetch(
      `http://localhost:8080/admin/users?search=${query}&page=${page}&size=${limit}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "http://localhost:5173",
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log("API ERROR: ", error);
    return { content: [], totalElements: 0 };
  }
};

// Update user API call
const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`http://localhost:8080/admin/users/${userId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "http://localhost:5173",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.log("API ERROR: ", error);
    throw new Error("Failed to update user");
  }
};

// Create user API call
const createUser = async (userData) => {
  try {
    const queryParams = new URLSearchParams({
      username: userData.username,
      password: userData.password,
      role: userData.role
    });
    
    const response = await fetch(`http://localhost:8080/admin/create-user?${queryParams}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "http://localhost:5173",
      }
    });
    return response.json();
  } catch (error) {
    console.log("API ERROR: ", error);
    throw new Error("Failed to create user");
  }
};

const UserTable = () => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [newUser, setNewUser] = useState({
    username: "",
    role: "USER",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [createPasswordError, setCreatePasswordError] = useState("");
  
  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [refreshTrigger, setRefreshTrigger] = useState(false); // refresh for editing
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await fetchUsers(
        searchQuery,
        paginationModel.page,
        paginationModel.pageSize
      );
      setRows(data.content);
      setTotalCount(data.totalElements);
      setLoading(false);
    };
    fetchData();
  }, [searchQuery, paginationModel.page, paginationModel.pageSize, refreshTrigger]);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditedUser({
      username: user.username,
      role: user.roles[0], // Take the first role for simplicity
      password: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setEditDialogOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/admin/users/delete?id=${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "http://localhost:5173",
        }
      });
      const result = await response.json();
      if(response.ok) {
        showAlert(result.message);
        setRefreshTrigger(prev => !prev);
      }
      else {
        showAlert(result.message, "error");
      }
    } catch (error) {
        console.log("api error", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
    
    // Clear password error when either password field changes
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    
    // Clear password error when either password field changes
    if (name === "password" || name === "confirmPassword") {
      setCreatePasswordError("");
    }
  };

  const handleSaveChanges = async () => {
    // Validate passwords match if password is being changed
    if (editedUser.password && editedUser.password !== editedUser.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
  
    try {
      // Prepare update data
      const updateData = {
        username: editedUser.username,
        roles: [editedUser.role], // Send as array, Spring will convert to Set
      };
  
      // Only include password if it was provided
      if (editedUser.password) {
        updateData.password = editedUser.password;
      }
  
      // Call API to update user
      await updateUser(currentUser.id, updateData);
      
      // Show success alert
      showAlert(`User ${editedUser.username} updated successfully`);
      
      // Refresh the data
      setRefreshTrigger(prev => !prev);
      
      // Close dialog
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      showAlert("Failed to update user", "error");
    }
  };

  const handleCreateUser = async () => {
    // Validate form
    if (!newUser.username) {
      showAlert("Username is required", "error");
      return;
    }
    
    if (!newUser.password) {
      showAlert("Password is required", "error");
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      setCreatePasswordError("Passwords don't match");
      return;
    }
  
    try {
      // Call API to create user
      const response = await createUser({
        username: newUser.username,
        password: newUser.password,
        role: newUser.role
      });
      
      if (response.message && response.message.includes("created")) {
        // Show success alert
        showAlert(`User ${newUser.username} created successfully`);
        
        // Refresh the data
        setRefreshTrigger(prev => !prev); 
        
        // Reset form and close dialog
        setNewUser({
          username: "",
          role: "USER",
          password: "",
          confirmPassword: "",
        });
        setCreateDialogOpen(false);
      } else {
        // Show error alert
        showAlert(response.message || "Failed to create user", "error");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      showAlert("Failed to create user", "error");
    }
  };

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
    setNewUser({
      username: "",
      role: "USER",
      password: "",
      confirmPassword: "",
    });
    setCreatePasswordError("");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 200 },
    { 
      field: "roles", 
      headerName: "Roles", 
      width: 200,
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(", ");
        }
        return params.value;
      }
    },
    { field: "createdAt", headerName: "Created At", width: 180 },
    { field: "updatedAt", headerName: "Updated At", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button 
            size="small" 
            variant="contained"
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button size="small" color="error" variant="contained" onClick={() => deleteUser(params.row.id)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ width: "98%", margin: "1%"}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <TextField
            label="Search Users"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
          >
            Create User
          </Button>
        </Box>
        <Box sx={{ 
          height: "70%", 
          width: "100%",
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none'
          }
        }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            loading={loading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '2px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: 'white',
              }
            }}
          />
        </Box>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={editedUser.username}
              onChange={handleInputChange}
            />
            
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={editedUser.role}
                onChange={handleInputChange}
                label="Role"
              >
                <MenuItem value="USER">USER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="New Password"
              name="password"
              type="password"
              value={editedUser.password}
              onChange={handleInputChange}
              helperText="Leave blank to keep current password"
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={editedUser.confirmPassword}
              onChange={handleInputChange}
              error={!!passwordError}
              helperText={passwordError || "Confirm your new password"}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleNewUserInputChange}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel id="create-role-label">Role</InputLabel>
              <Select
                labelId="create-role-label"
                name="role"
                value={newUser.role}
                onChange={handleNewUserInputChange}
                label="Role"
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={newUser.password}
              onChange={handleNewUserInputChange}
              required
            />
            
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={newUser.confirmPassword}
              onChange={handleNewUserInputChange}
              error={!!createPasswordError}
              helperText={createPasswordError || "Confirm your password"}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" color="primary">
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Alert */}
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={alertSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserTable;