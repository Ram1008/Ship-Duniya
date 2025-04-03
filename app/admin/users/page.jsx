"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import EditUser from "../_components/EditUser";
import axiosInstance from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { EditIcon, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  // Separate filters for customer type and user type
  const [customerFilter, setCustomerFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/admin/users");
      console.log("User res: ", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = async (updatedUser) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/users/${updatedUser._id}`,
        updatedUser
      );
      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await axiosInstance.post(`/admin/user`, newUser);
      if (response.status === 200) {
        setUsers([...users, newUser]);
        setAddingUser(false);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmed) {
      try {
        const response = await axiosInstance.delete(`/admin/user/${id}`);
        if (response.status === 200) {
          setUsers(users.filter((user) => user._id !== id));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Filter users based on the selected date range, customer type, and user type.
  const filteredUsers = users.filter((user) => {
    // Check date range filtering first.
    const createdAtDate = new Date(user.createdAt);
    if (createdAtDate < dateRange.from || createdAtDate > dateRange.to) {
      return false;
    }
    // Check customer type filter.
    const matchesCustomer =
      customerFilter === "" ||
      user.customerType?.toLowerCase() === customerFilter;
    // Check user type filter.
    const matchesUserType =
      userTypeFilter === "" ||
      user.userType?.toLowerCase() === userTypeFilter;
    return matchesCustomer && matchesUserType;
  });

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="mb-4 text-2xl font-bold">User Management</h2>
          <Button
            variant="export"
            size="lg"
            onClick={() => setAddingUser(true)}
          >
            <span className="text-md">+ Add User</span>
          </Button>
        </div>
        <div className="flex flex-wrap align-center justify-between mb-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        {/* Customer Type Filter Buttons */}
        <div className="flex justify-between mb-3">
          <div className="flex gap-2">
            {["All", "Bronze", "Gold", "Diamond", "Silver"].map((type) => (
              <Button
                key={type}
                variant={
                  customerFilter === type.toLowerCase() ||
                  (type === "All" && customerFilter === "")
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setCustomerFilter(type === "All" ? "" : type.toLowerCase())
                }
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              { label: "All", value: "" },
              { label: "Warehouse Pickup", value: "wp" },
              { label: "Direct Pickup", value: "dp" },
            ].map(({ label, value }) => (
              <Button
                key={label}
                variant={userTypeFilter === value ? "default" : "outline"}
                onClick={() => setUserTypeFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">
                Mobile Number
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Customer Type
              </TableHead>
              <TableHead className="hidden md:table-cell">User Type</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.phone || "123"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.customerType || "Bronze"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.userType === "wp"
                    ? "Warehouse Pickup"
                    : user.userType === "dp"
                    ? "Direct Pickup"
                    : user.userType}
                </TableCell>
                <TableCell className="flex gap-2 text-center">
                  <Button
                    size="sm"
                    variant="export"
                    onClick={() => handleEdit(user)}
                  >
                    <EditIcon className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <button
                    className="rounded bg-red-500 px-2 text-white hover:bg-red-600"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        {editingUser && (
          <EditUser
            user={editingUser}
            onSave={handleSave}
            onClose={() => setEditingUser(null)}
          />
        )}
      </Dialog>
      <Dialog open={addingUser} onOpenChange={() => setAddingUser(false)}>
        {addingUser && (
          <EditUser
            onSave={handleAddUser}
            onClose={() => setAddingUser(false)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default UserDetails;
