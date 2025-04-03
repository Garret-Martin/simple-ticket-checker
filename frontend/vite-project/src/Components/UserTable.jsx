import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Mock data for testing
const mockUsers = [
  {
    id: 1,
    username: "testuser",
    password:
      "$2a$10$TN5xrwoORwoE1MC5EtqTheoFX/MH6AWQbdQu7BHQtxwa0yr8289Me",
    roles: ["USER"],
    createdAt: "2025-03-13T18:29:06.288806",
    updatedAt: null,
    createdBy: null,
  },
  {
    id: 2,
    username: "admin",
    password:
      "$2a$10$5pm2a310QyNQIjpUiYLW0O9F1kaAkANuITwvGTgmKEUni8fgra/12",
    roles: ["ADMIN"],
    createdAt: "2025-03-23T19:45:31.20612",
    updatedAt: null,
    createdBy: null,
  },
];

const UserTable = ({ loading }) => {
  const [rows, setRows] = useState(
    mockUsers.map((user) => ({
      ...user,
      createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
      updatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A",
    }))
  );
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleEditClick = (id) => {
    setEditingId(id);
    setEditValues(rows.find((row) => row.id === id));
  };

  const handleSaveClick = () => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === editingId ? { ...row, ...editValues } : row))
    );
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteUser = (id) => {
    console.log("Deleting User ID:", id);
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) =>
        editingId === params.row.id ? (
          <TextField
            value={editValues.username || ""}
            onChange={(e) => handleInputChange("username", e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
        ) : (
          params.value
        ),
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 200,
      renderCell: (params) =>
        editingId === params.row.id ? (
          <TextField
            select
            fullWidth
            variant="outlined"
            size="small"
            value={editValues.roles ? editValues.roles[0] : ""}
            onChange={(e) => handleInputChange("roles", [e.target.value])}
            SelectProps={{ native: true }}
          >
            <option value="USER">USER</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </TextField>
        ) : (
          params.value.join(", ")
        ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 180,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        editingId === params.row.id ? (
          <Box display="flex" gap={1}>
            <Button onClick={handleSaveClick} color="success" size="small" variant="contained">
              Confirm
            </Button>
            <Button onClick={handleCancelClick} color="warning" size="small" variant="contained">
              Discard
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button onClick={() => handleEditClick(params.row.id)} size="small" variant="contained">
              Edit
            </Button>
            <Button onClick={() => handleDeleteUser(params.row.id)} color="error" size="small" variant="contained">
              Delete
            </Button>
          </Box>
        )
      ),
    },
  ];

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick // Prevents accidental selection on cell click
      />
    </Paper>
  );
};

export default UserTable;
