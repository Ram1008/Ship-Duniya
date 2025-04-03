'use client';

import React, { useState } from 'react';
import { ChevronDown, CircleUserRound, Menu, User, UserRound, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Dialog } from '@/components/ui/dialog';
import EditUser from '@/app/admin/_components/EditUser';
import Profile from '@/app/admin/_components/Profile';
import { handleLogout } from '@/utils/helpers';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Header = ({ type, toggleSidebar, activeTab }) => {
  const router = useRouter()
  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = (user) => {
    setEditingUser(true);
  };
  const handleLogout = () => {
    Cookies.remove('token');
  
    router.push('/login');
  };
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <button onClick={toggleSidebar} className="text-gray-500 lg:hidden">
        <Menu className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-semibold">{activeTab}</h1>
      <div className="flex items-center">
        <div className="relative">
          <CircleUserRound onClick={() => handleEdit()} size={30} className="hover:text-gray-700" />
        </div>
      </div>

      <Dialog
        className="px-2"
        open={!!editingUser}
        onOpenChange={() => setEditingUser(null)}
      >
        {editingUser && (
          <User
            type={type}
            user={editingUser}
            onClose={() => setEditingUser(null)}
          />
        )}
      </Dialog>
    </header>
  );
};

export default Header;
