import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AccountIcon() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        credentials: "include",
        Origin: "http://localhost:5173",
      });
      if (response.ok) {
        console.log("logged out");
        navigate("/login");
      } else {
        console.log("loggout unsuccesfull");
      }
    } catch (error) {
      console.log("api error", error);
    }
  };
  const handleLogout = () => {
    // Implement logout functionality here (e.g., clear session, redirect)
    console.log("Logging out...");
    logout();
    handleClose();
  };

  const handleAdminPage = () => {
    // Redirect to the admin page
    console.log("Navigating to admin page...");
    navigate("/admin");
    handleClose();
  };

  return (
    <div style={{ position: "absolute", top: "20px", right: "20px"}}>
      <IconButton onClick={handleClick}>
        <AccountCircle fontSize="large"/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "account-button",
        }}
      >
        {<MenuItem onClick={handleAdminPage}>Admin Page</MenuItem>}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
