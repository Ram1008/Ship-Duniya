'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { CirclePlus, Trash2, SquarePen } from 'lucide-react';
import CreateStaff from './CreateStaff';
import EditStaff from './EditStaff';
import axiosInstance from '@/utils/axios';
import { ButtonBase } from '@mui/material';

const Staffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleEdit = (staff) => {
    setEditingStaff(staff);
  };

  const handleSave = () => {};

  const handleDelete = async (userId) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this staff?'
    );
    if (!confirm) {
      return;
    } else {
      setDeleteLoading(userId);
      try {
        await axiosInstance.delete(`/superadmin/staff/${userId}`);
        setStaffs((prevStaffs) =>
          prevStaffs.filter((staff) => staff._id !== userId)
        );
      } catch (error) {
        console.error('Error deleting staff:', error);
      } finally {
        setDeleteLoading(null);
      }
    }
  };
  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/superadmin/staffs');
      setStaffs(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex justify-between items-center">
        <h2 className="mb-4 text-2xl font-bold">Staff Management</h2>
        <Button
          variant="export"
          size="lg"
          className="flex gap-2 items-center mb-6"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          {/* <CirclePlus size={15} /> */}+ Add Staff
        </Button>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                Email
              </th>

              <th className="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:table-cell">
                Role
              </th>
              <th className="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:table-cell">
                Address
              </th>
              <th className="hidden px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:table-cell">
                Mobile Number
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {staffs.map((user) => (
              <tr key={user.userId}>
                <td className="px-6 py-3 text-sm font-semibold">
                  {user.userId || user._id}
                </td>
                <td className="px-6 py-3 text-sm">{user.name}</td>
                <td className="hidden whitespace-nowrap px-6 py-3 md:table-cell text-sm">
                  {user.email}
                </td>
                <td className="hidden whitespace-nowrap px-6 py-3 lg:table-cell text-sm">
                  {user.role}
                </td>
                <td className="hidden whitespace-nowrap px-6 py-3 lg:table-cell text-sm">
                  {user.address || "N/A"}
                </td>
                <td className="hidden whitespace-nowrap px-6 py-3 lg:table-cell text-sm">
                  {user.phone || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-2 flex gap-2 text-sm">
                  <Button
                    size="sm"
                    variant="export"
                    onClick={() => handleEdit(user)}
                  >
                    <SquarePen className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <button
                    className="rounded bg-red-500 px-2 text-white hover:bg-red-600"
                    onClick={() => handleDelete(user._id)}
                    disabled={deleteLoading === user.userId}
                  >
                    {deleteLoading === user.userId ? (
                      <span>Deleting...</span>
                    ) : (
                      <>
                        <span className="hidden md:inline ml-1">Delete</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Dialog
        className="px-2"
        open={!!editingStaff}
        onOpenChange={() => setEditingStaff(null)}
      >
        {editingStaff && (
          <EditStaff
            staff={editingStaff}
            fetchStaffs={fetchStaffs}
            onClose={() => setEditingStaff(null)}
          />
        )}
      </Dialog>
      <Dialog
        className="px-2"
        open={!!isCreateDialogOpen}
        onOpenChange={() => setIsCreateDialogOpen(null)}
      >
        {isCreateDialogOpen && (
          <CreateStaff
            staffs={staffs}
            setStaffs={setStaffs}
            setIsCreateDialogOpen={setIsCreateDialogOpen}
            onClose={() => setEditingStaff(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Staffs;
