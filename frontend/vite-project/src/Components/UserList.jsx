import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Fab, TextField } from "@mui/material";

const UserList = ({ users, loading }) => {
  //add username changing and password changing

  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <ul className="list-group">
      {users.map((user, index) => (
        <div key={index} className="userItem">
          <div className="username">
            <li id="username">Username: {user.username}</li>
            <Fab color="gray" aria-label="edit" size="small"> 
              <EditIcon />
            </Fab>
          </div>
          <li id="role">Role: {user.roles}</li>
          <li id="createdAt">
            Created At: {new Date(user.createdAt).toLocaleString()}
          </li>
          <li id="updatedAt">
            Updated At:{" "}
            {user.updatedAt
              ? new Date(user.updatedAt).toLocaleString()
              : "Null"}
          </li>
          <li>Created by: {user.createdBy ? user.createdBy : "Unknown"}</li>
          <div className="passwordFeild">
            <TextField
              id="standard-basic"
              label="Set password"
              variant="outlined"
              size="small"
            />
            <button>Submit</button>
          </div>
        </div>
      ))}
    </ul>
  );
};

export default UserList;
