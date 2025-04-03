"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import axiosInstance from "@/utils/axios";
import Pagination from "@/components/custom/Pagination";


const SupportTicket = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [selectedIssueType, setSelectedIssueType] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2025, 11, 31),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [showRepliesDialog, setShowRepliesDialog] = useState(false);
  const [selectedRepliesTicket, setSelectedRepliesTicket] = useState(null);

  const pageSize = 10;

  // Modified truncateText function to strictly limit to 50 characters
  const truncateText = (text) => {
    if (!text) return "No description";
    return text.length > 20 ? `${text.substring(0, 20)}...` : text;
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/ticket/all`);

      if (response.data.tickets) {
        setTickets(response.data.tickets);
        // Extract unique issue types for filter buttons
        const uniqueIssueTypes = [
          ...new Set(
            response.data.tickets
              .map((ticket) => ticket.issueType)
              .filter((type) => type)
          ),
        ];
        setIssueTypes(uniqueIssueTypes);
        setCustomers([
          ...new Set(
            response.data.tickets
              .map((ticket) => ticket.userId?.name)
              .filter((name) => name)
          ),
        ]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Failed to fetch tickets: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleRepliesClick = (e, ticket) => {
    e.stopPropagation();
    setSelectedRepliesTicket(ticket);
    setShowRepliesDialog(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedRepliesTicket) return;

    try {
      setSendingReply(true);

      const newMessage = {
        message: replyText,
        sender: "Support Agent",
        createdAt: new Date().toISOString(),
      };

      const response = await axiosInstance.post(
        `/ticket/${selectedRepliesTicket._id}/chat`,
        newMessage
      );

      setTickets(
        tickets.map((ticket) =>
          ticket._id === selectedRepliesTicket._id
            ? {
                ...ticket,
                messages: [...(ticket.messages || []), newMessage],
              }
            : ticket
        )
      );

      setReplyText("");
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await axiosInstance.put(`/ticket/${ticketId}/status`, {
        status: newStatus,
      });

      setTickets(
        tickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Failed to update ticket status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-yellow-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "resolved":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      (ticket.userId?.name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (ticket.issueType?.toString().toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (ticket.subject?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesCustomer =
      selectedCustomer === "all" ||
      (selectedCustomer === "Unassigned" && !ticket.userId?.name) ||
      ticket.userId?.name === selectedCustomer;

    const matchesDate =
      (!dateRange.from || new Date(ticket.createdAt) >= dateRange.from) &&
      (!dateRange.to || new Date(ticket.createdAt) <= dateRange.to);

    const matchesIssueType =
      selectedIssueType === "all" || ticket.issueType === selectedIssueType;

    return matchesSearch && matchesCustomer && matchesIssueType && matchesDate;
  });

  const filterButtons = [
    { id: "all", label: "All Issues" },
    ...issueTypes.map((type) => ({
      id: type,
      label: type,
    })),
  ];

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleBackClick = () => {
    setSelectedTicket(null);
  };

  const StatusDropdown = ({ ticketId, currentStatus }) => (
    <Select
      defaultValue={currentStatus}
      onValueChange={(value) => updateTicketStatus(ticketId, value)}
    >
      <SelectTrigger className={`w-[120px] ${getStatusColor(currentStatus)}`}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
      </SelectContent>
    </Select>
  );

  // Calculate pagination
  const totalItems = filteredTickets.length;
  const lastPageIndex = currentPage * pageSize;
  const firstPageIndex = lastPageIndex - pageSize;
  const currentTickets = filteredTickets.slice(firstPageIndex, lastPageIndex);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <Card className="bg-white shadow-md">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="mr-3 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <CardTitle className="text-xl text-gray-800">
              Ticket Details
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">
                Ticket {selectedTicket.ticketId}
              </h3>
              <Badge
                className={`${getStatusColor(
                  selectedTicket.status
                )} px-4 py-4 rounded-full text-sm font-medium`}
              >
                {selectedTicket.status}
              </Badge>
            </div>
            <div className="grid gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="font-medium">
                    {selectedTicket.userId?.name || "Not Assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium">
                    {selectedTicket.userId?.email || "Not Available"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Issue Type</p>
                <p className="font-medium">
                  {selectedTicket.issueType || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p className="font-medium">
                  {selectedTicket.subject || "No Subject"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="font-medium whitespace-pre-wrap">
                  {selectedTicket.description || "No Description"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="font-medium">
                  {selectedTicket.createdAt
                    ? new Date(selectedTicket.createdAt).toLocaleString()
                    : "Date not available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="p-6 border-b border-gray-100">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Ticket Support
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Total: {filteredTickets.length} tickets
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Picker */}
            <div className="w-[300px]">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            {/* Issue Type Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.id}
                  variant={
                    selectedIssueType === filter.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedIssueType(filter.id)}
                  className="px-3 py-2 h-10"
                  size="sm"
                >
                  {filter.label}
                  <Badge variant="secondary" className="ml-2 bg-gray-100">
                    {
                      tickets.filter((ticket) =>
                        filter.id === "all"
                          ? true
                          : ticket.issueType === filter.id
                      ).length
                    }
                  </Badge>
                </Button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search tickets..."
              className="flex-1 px-4 py-2 h-10 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Replies
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No tickets found
                </td>
              </tr>
            ) : (
              currentTickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <span className="font-medium text-gray-900">
                      {ticket.ticketId}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <span className="text-gray-800">
                      {ticket.userId?.name || "Not Assigned"}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <span className="text-gray-800">
                      {ticket.issueType || "N/A"}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <span className="text-gray-800 truncate block max-w-md">
                      {ticket.subject || "No Subject"}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <span
                      className="text-gray-800 truncate block max-w-md"
                      title={ticket.description}
                    >
                      {truncateText(ticket.description)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusDropdown
                      ticketId={ticket._id}
                      currentStatus={ticket.status}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className="bg-white p-2 px-4 border border-primary text-primary cursor-pointer hover:bg-primary hover:text-white"
                      onClick={(e) => handleRepliesClick(e, ticket)}
                    >
                      {ticket.messages?.length || 0} Replies
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={showRepliesDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowRepliesDialog(false);
            setSelectedRepliesTicket(null);
            setReplyText("");
          }
        }}
      >
        <DialogContent>
          {selectedRepliesTicket && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRepliesTicket.issueType}</DialogTitle>
                <DialogDescription>
                  {selectedRepliesTicket.subject}
                </DialogDescription>
                <DialogDescription>
                  {selectedRepliesTicket.description}
                </DialogDescription>
              </DialogHeader>

              <p className="text-xs text-gray-400">
                Created on:{" "}
                {new Date(selectedRepliesTicket.createdAt).toLocaleString()}
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold">Replies</h3>
                {selectedRepliesTicket?.messages?.length > 0 ? (
                  <ul className="space-y-2 mt-2">
                    {selectedRepliesTicket.messages.map((reply, index) => (
                      <li
                        key={index}
                        className={`p-3 rounded-md ${
                          reply.sender === "Support Agent"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="font-semibold">
                          {reply.sender === "Support Agent"
                            ? "👑 Support Agent"
                            : "Customer"}
                        </p>
                        <p className="text-sm">{reply.message}</p>
                        <p className="text-xs text-gray-400">
                          Sent on: {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">No replies yet.</p>
                )}
              </div>

              <div className="mt-6">
                <textarea
                  placeholder="Type your reply..."
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sendingReply}
                  className="mt-2"
                >
                  {sendingReply ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SupportTicket;
