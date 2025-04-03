'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { LogOut, X } from 'lucide-react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const Sidebar = ({ sidebarOpen, toggleSidebar, navItems }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab by checking if the current pathname starts with the nav item URL.
  const activeTab = navItems.find((item) => pathname.startsWith(item.url))?.name;

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-46 bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between bg-gray-800">
          
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-grow mt-[10%] gap-3 px-4">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={activeTab === item.name ? "secondary" : "ghost"}
              className={`flex w-full justify-start p-4 mb-2 text-left hover:bg-gray-700 hover:text-white rounded-xl text-white ${
                activeTab === item.name ? "bg-white text-gray-800 rounded-xl" : ""
              }`}
              onClick={() => {
                router.push(item.url);
                toggleSidebar();
              }}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Profile and Logout at the Bottom */}
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="ghost"
            className="mt-2 w-full gap-4 justify-start text-white hover:bg-gray-700 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Sidebar;
