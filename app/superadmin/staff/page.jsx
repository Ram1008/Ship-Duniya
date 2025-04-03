'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import EditUser from '../../admin/_components/EditUser';
import axiosInstance from '@/utils/axios';
import { Button } from '@/components/ui/button';
import { EditIcon, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const Staff = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [addingUser, setAddingUser] = useState(false);
  
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/admin/fetchusers");
        console.log("staff res: ", response.data);

        // Ensure the response contains the users array
        const allUsers = response.data.users || [];

        // Filter only admin and support users
        const filteredUsers = allUsers.filter(
          (user) => user.role === "admin" || user.role === "support"
        );

        setUsers(filteredUsers);
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
      console.log({updatedUser})
      try {
        const response = await axiosInstance.patch(`/users/${updatedUser._id}`, updatedUser);
        if (response.status === 200) {
          setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
          setEditingUser(null);
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };
  
    const handleAddUser = async (newUser) => {
      console.log({newUser})
      try {
        const response = await axiosInstance.post(`/admin/user`, newUser);
        if (response.status === 200) {
          setUsers([...users, newUser]);
          setAddingUser(false);
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  
    const handleDelete = async (id) => {
      const confirmed = window.confirm('Are you sure you want to delete this user?');
    
      if (confirmed) {
        try {
          const response = await axiosInstance.delete(`/admin/user/${id}`);
    
          if (response.status === 200) {
            setUsers(users.filter((user) => user._id !== id));
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    };
  
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex justify-between item-center">
          <h2 className="mb-4 text-2xl font-bold">Staff Management</h2>
          <Button
            variant="export"
            size="lg"
            onClick={() => setAddingUser(true)}
          >
            <span className="text-md">+ Add Staff </span>
          </Button>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ID
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </TableHead>
                <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                  Email
                </TableHead>
                <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                  Address
                </TableHead>
                <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                  Mobile Number
                </TableHead>
                <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                  Role
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length > 0 ? (
                users
                  .filter(
                    (user) => user.role === "admin" || user.role === "support"
                  )
                  .map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="px-6 py-4 font-semibold">
                        {user._id}
                      </TableCell>
                      <TableCell className="px-6 py-4">{user.name}</TableCell>
                      <TableCell className="hidden px-6 py-4 md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 md:table-cell">
                        {user.address || "N/A"}
                      </TableCell>
                      <TableCell className="hidden px-6 py-4 md:table-cell">
                        {user.phone}
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell
                        className=" flex 
                gap-2 whitespace-nowrap px-4 py-4"
                      >
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
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan="6" className="px-6 py-4 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <Dialog
          className="px-2"
          open={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
        >
          {editingUser && (
            <EditUser
              user={editingUser}
              onSave={handleSave}
              onClose={() => setEditingUser(null)}
            />
          )}
        </Dialog>
        <Dialog
          className="px-2"
          open={addingUser}
          onOpenChange={() => setAddingUser(false)}
        >
          {addingUser && (
            <EditUser
              onSave={handleAddUser}
              onClose={() => setAddingUser(false)}
            />
          )}
        </Dialog>
      </div>
    );
}

export default Staff;
