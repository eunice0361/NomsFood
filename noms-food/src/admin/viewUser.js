import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const db = getFirestore();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "Users");
      const q =
        filter === "all"
          ? usersRef
          : query(usersRef, where("type", "==", filter));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, [filter]);

  const updateUserStatus = (uid, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === uid ? { ...user, status: newStatus } : user
      )
    );
  };

  const disableUserAccount = async (uid) => {
    try {
      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, { status: "Banned" });
      updateUserStatus(uid, "Banned");
      console.log(`User account with UID ${uid} disabled successfully.`);
    } catch (error) {
      console.error("Error disabling user account:", error);
    }
  };

  const enableUserAccount = async (uid) => {
    try {
      const userRef = doc(db, "Users", uid);
      await updateDoc(userRef, { status: "Active" });
      updateUserStatus(uid, "Active");
      console.log(`User account with UID ${uid} enabled successfully.`);
    } catch (error) {
      console.error("Error enabling user account:", error);
    }
  };

  return (
    <Paper sx={{ margin: "auto", overflow: "hidden", marginTop: "64px" }}>
      <FormControl sx={{ margin: 2, width: "20%" }}>
        <InputLabel id="role-filter-label">Filter by role</InputLabel>
        <Select
          labelId="role-filter-label"
          id="role-filter"
          value={filter}
          label="Filter by role"
          onChange={(event) => setFilter(event.target.value)}
        >
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="Customer">Customer</MenuItem>
          <MenuItem value="Vendor">Vendor</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contact}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell
                  sx={{ color: user.status === "Banned" ? "red" : "green" }}
                >
                  {user.status}
                </TableCell>
                <TableCell>
                  {user.type === "Admin" ? (
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  ) : (
                    <div>
                      {user.status === "Banned" ? (
                        <IconButton
                          color="primary"
                          onClick={() => enableUserAccount(user.id)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="secondary"
                          onClick={() => disableUserAccount(user.id)}
                        >
                          <BlockIcon />
                        </IconButton>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminUsersPage;
