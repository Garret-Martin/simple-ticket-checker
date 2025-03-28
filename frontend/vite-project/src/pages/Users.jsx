import React, { useState } from "react";
import "./Users.css";
import PeopleIcon from "@mui/icons-material/People";
import UserList from "../Components/UserList";
import { Pagination } from "@mui/material";
function Users() {
  const { loading, setLoading } = useState(false);
  const [users, setUsers] = useState([
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
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(users);

  return (
    <div>
      <div className="toolArea">
        <div className="iconAndCreate">
          <PeopleIcon id="icon" />
          <button id="createButton">New User</button>
        </div>
        <div className="search">
          <input
            placeholder="Search"
            onInput={(e) => {
              setSearchQuery(e.target.value);
            }}
            value={searchQuery}
          ></input>
        </div>
      </div>
      <UserList className="userList" users={users} loading={loading}></UserList>
      <Pagination count={2} size="small" />
    </div>
  );
}
export default Users;
