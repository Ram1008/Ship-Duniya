// "use client";

// import React, { useState, useEffect } from "react";
// import { Dialog } from "@/components/ui/dialog";
// import EditUser from "./EditUser";
// import axiosInstance from "@/utils/axios";
// import { Button } from "@/components/ui/button";
// import { EditIcon, Plus } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const UserDetails = () => {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [addingUser, setAddingUser] = useState(false);

//   const fetchUsers = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axiosInstance.get("/admin/users");
//       console.log("User res: ", response.data);
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleEdit = (user) => {
//     setEditingUser(user);
//   };

//   const handleSave = async (updatedUser) => {
//     console.log({ updatedUser });
//     try {
//       const response = await axiosInstance.patch(
//         `/admin/users/${updatedUser._id}`,
//         updatedUser
//       );
//       if (response.status === 200) {
//         setUsers(
//           users.map((user) =>
//             user._id === updatedUser._id ? updatedUser : user
//           )
//         );
//         setEditingUser(null);
//       }
//     } catch (error) {
//       console.error("Error saving user data:", error);
//     }
//   };

//   const handleAddUser = async (newUser) => {
//     console.log(newUser);
//     try {
//       const response = await axiosInstance.post(`/admin/user`, newUser);
//       if (response.status === 200) {
//         setUsers([...users, newUser]);
//         setAddingUser(false);
//       }
//     } catch (error) {
//       console.error("Error saving user data:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this user?"
//     );

//     if (confirmed) {
//       try {
//         const response = await axiosInstance.delete(`/admin/user/${id}`);
//         console.log("delete res: ", response);

//         if (response.status === 200) {
//           setUsers(users.filter((user) => user._id !== id));
//         }
//       } catch (error) {
//         console.error("Error deleting user:", error);
//       }
//     }
//   };

//   return (
//     <div className="rounded-lg bg-white p-6 shadow">
//       <div className="flex flex-col">
//         <div className="flex justify-between">
//           <h2 className="mb-4 text-2xl font-bold">User Management</h2>
//           <Button
//             variant="export"
//             size="lg"
//             onClick={() => setAddingUser(true)}
//           >
//             <span className="text-md">+ Add User </span>
//           </Button>
//         </div>

//         {/* Filtered Buttons */}
//         <div className="flex justify-between">
//           <div className="flex gap-2 mb-6">
//             <Button>
//               <span className=""> Bronze </span>
//             </Button>
//             <Button>
//               <span className=""> Gold </span>
//             </Button>
//             <Button>
//               <span className="">Diamond </span>
//             </Button>
//             <Button>
//               <span className=""> Silver </span>
//             </Button>
//           </div>
//           <div className="flex gap-2 border-2 bg-gray-400 p-2">
//             <Button>
//               <span className="">WareHouse </span>
//             </Button>
//             <Button>
//               <span className="">Direct Pickup</span>
//             </Button>
//           </div>
//         </div>
//       </div>
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <Table className="min-w-full divide-y divide-gray-200">
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                 ID
//               </TableHead>
//               <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                 Name
//               </TableHead>
//               <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
//                 Email
//               </TableHead>
//               <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
//                 Phone Number
//               </TableHead>
//               <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
//                 Customer Type
//               </TableHead>
//               <TableHead className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
//                 User Type
//               </TableHead>

//               <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                 Actions
//               </TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody className="divide-y divide-gray-200 bg-white">
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell className="px-2 py-4 font-semibold">
//                   {user._id}
//                 </TableCell>
//                 <TableCell className="px-2 py-4">{user.name}</TableCell>
//                 <TableCell className="hidden whitespace-nowrap px-6 py-4 md:table-cell">
//                   {user.email}
//                 </TableCell>
//                 <TableCell className="hidden md:table-cell whitespace-nowrap px-2 py-4">
//                   {user.phone || "123"}
//                 </TableCell>
//                 <TableCell className="hidden md:table-cell whitespace-nowrap px-2 py-4">
//                   {user.customerType ? user.customerType : "Bronze"}
//                 </TableCell>
//                 <TableCell className="hidden whitespace-nowrap text-center py-4 md:table-cell">
//                   {user.userType}
//                 </TableCell>

//                 <TableCell
//                   className=" flex
//                 gap-2 whitespace-nowrap px-4 py-4"
//                 >
//                   <Button
//                     size="sm"
//                     variant="export"
//                     onClick={() => handleEdit(user)}
//                   >
//                     <EditIcon className="h-4 w-4 mr-2" /> Edit
//                   </Button>
//                   <button
//                     className="rounded bg-red-500 px-2  text-white hover:bg-red-600"
//                     onClick={() => handleDelete(user._id)}
//                   >
//                     Delete
//                   </button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//       <Dialog
//         className="px-2"
//         open={!!editingUser}
//         onOpenChange={() => setEditingUser(null)}
//       >
//         {editingUser && (
//           <EditUser
//             user={editingUser}
//             onSave={handleSave}
//             onClose={() => setEditingUser(null)}
//           />
//         )}
//       </Dialog>
//       <Dialog
//         className="px-2"
//         open={addingUser}
//         onOpenChange={() => setAddingUser(false)}
//       >
//         {addingUser && (
//           <EditUser
//             onSave={handleAddUser}
//             onClose={() => setAddingUser(false)}
//           />
//         )}
//       </Dialog>
//     </div>
//   );
// };

// export default UserDetails;

"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import EditUser from "./EditUser";
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

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  const [filter, setFilter] = useState("");

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

  // Filtered users based on selected filter
  const filteredUsers = users.filter((user) => {
    if (filter === "" || filter === "all") return true; // Show all users if "All" is selected

    const lowerFilter = filter.toLowerCase();

    // Match customerType or userType with the filter
    return (
      user.customerType?.toLowerCase() === lowerFilter ||
      user.userType?.toLowerCase() === lowerFilter
    );
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

        {/* Filtered Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-2 mb-6">
            {["All", "Bronze", "Gold", "Diamond", "Silver"].map((type) => (
              <Button
                key={type}
                variant={
                  filter === type.toLowerCase() ||
                  (type === "All" && filter === "")
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setFilter(type === "All" ? "" : type.toLowerCase())
                }
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {[
              { label: "Warehouse Pickup", value: "wp" },
              { label: "Direct Pickup", value: "dp" },
            ].map(({ label, value }) => (
              <Button
                key={label}
                variant={filter === value ? "default" : "outline"}
                onClick={() => setFilter(value)} // Pass lowercase value
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
