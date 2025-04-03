'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Eye, Loader2, ChevronRight, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import axiosInstance from '@/utils/axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const Transactions=()=> {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setUserDetails(response.data);
    } catch (err) {}
  };

  useEffect(() =>{
    fetchUserData();
  }, [])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/transactions/admin');
        if (response.status === 200) {
          const transactionsWithDates = response.data.map(transaction => ({
            ...transaction,
            updatedAt: new Date(transaction.updatedAt),
            requested_at: transaction.requested_at ? new Date(transaction.requested_at) : null,
            confirmed_at: transaction.confirmed_at ? new Date(transaction.confirmed_at) : null,
          }));
          setTransactions(transactionsWithDates);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  }

  const toggleUserExpanded = (sellerId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [sellerId]: !prev[sellerId]
    }));
  }

  // Group transactions by sellerId
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const sellerId = userDetails?._id;
    if (!groups[sellerId]) {
      groups[sellerId] = {
        sellerId: userDetails?._id,
        sellerName: userDetails?.name || 'N/A', // Add sellerName if available
        transactions: [],
        totalAmount: 0,
        totalTransactions: 0,
        latestBalance: transaction.balance
      };
    }
    groups[sellerId].transactions.push(transaction);
    groups[sellerId].totalAmount += transaction.amount;
    groups[sellerId].totalTransactions += 1;
    return groups;
  }, {});

  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className='text-2xl font-bold'>Transactions</h1>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wallet" className="mx-auto my-3">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="wallet">Wallet Transactions</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Transactions</TabsTrigger>
            <TabsTrigger value="weight">Weight Reconciliation</TabsTrigger>
          </TabsList>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
            </div>
          ) : (
            <TabsContent value='wallet'>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Seller ID</TableHead>
                      <TableHead>Seller Name</TableHead>
                      <TableHead className="text-right">Total Transactions</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">Current Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(groupedTransactions).map((userData) => (
                      <>
                        <TableRow key={userData.sellerId} className="hover:bg-gray-50">
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserExpanded(userData.sellerId)}
                              className="p-0 h-8 w-8"
                            >
                              {expandedUsers[userData.sellerId] ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </Button>
                          </TableCell>
                          <TableCell>{userData.sellerId}</TableCell>
                          <TableCell>{userData.sellerName}</TableCell>
                          <TableCell className="text-right">{userData.totalTransactions}</TableCell>
                          <TableCell className="text-right">
                            {userData.transactions[0]?.currency} {userData.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">{userData.latestBalance}</TableCell>
                        </TableRow>
                        {expandedUsers[userData.sellerId] && (
                          <TableRow>
                            <TableCell colSpan={6} className="p-0">
                              <div className="border-t bg-gray-50 p-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                    
                                      <TableHead>Transaction ID</TableHead>
                                      <TableHead>Amount</TableHead>
                                      <TableHead>Date</TableHead>
                                      <TableHead className="text-center">Status</TableHead>
                                      <TableHead className="text-right">Balance</TableHead>
                                      <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {userData.transactions.map((transaction) => (
                                      <TableRow key={transaction._id}>
                                        <TableCell className="font-medium">
                                          {transaction.transactionId}
                                        </TableCell>
                                        <TableCell>
                                          {transaction.currency} {transaction.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                          {format(new Date(transaction.updatedAt), 'dd MMM yyyy')}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <Badge className={`${getStatusColor(transaction.status)} font-medium`}>
                                            {transaction.status}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {transaction.balance}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleViewDetails(transaction)}
                                              >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Details
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                              <DialogHeader>
                                                <DialogTitle>Transaction Details</DialogTitle>
                                                <DialogDescription>
                                                  Full details of the transaction
                                                </DialogDescription>
                                              </DialogHeader>
                                              {selectedTransaction && (
                                                <div className="grid gap-4 py-4">
                                                  <div className="grid grid-cols-4 items-center gap-4">
                                                    <span className="font-bold">Order ID:</span>
                                                    <span className="col-span-3">{selectedTransaction.orderId}</span>
                                                  </div>
                                                  <div className="grid grid-cols-4 items-center gap-4">
                                                    <span className="font-bold">Amount:</span>
                                                    <span className="col-span-3">
                                                      {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                                                    </span>
                                                  </div>
                                                  <div className="grid grid-cols-4 items-center gap-4">
                                                    <span className="font-bold">Status:</span>
                                                    <span className="col-span-3">
                                                      <Badge className={`${getStatusColor(selectedTransaction.status)} font-medium`}>
                                                        {selectedTransaction.status}
                                                      </Badge>
                                                    </span>
                                                  </div>
                                                  <div className="grid grid-cols-4 items-center gap-4">
                                                    <span className="font-bold">Requested:</span>
                                                    <span className="col-span-3">
                                                      {format(new Date(selectedTransaction.requested_at), 'PPp')}
                                                    </span>
                                                  </div>
                                                  {selectedTransaction.confirmed_at && (
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                      <span className="font-bold">Confirmed:</span>
                                                      <span className="col-span-3">
                                                        {format(new Date(selectedTransaction.confirmed_at), 'PPp')}
                                                      </span>
                                                    </div>
                                                  )}
                                                  <div className="grid grid-cols-4 items-center gap-4">
                                                    <span className="font-bold">Payment ID:</span>
                                                    <span className="col-span-3">{selectedTransaction.paymentId}</span>
                                                  </div>
                                                  <div className="grid grid-cols-4 items-center gap-4">
                                                    <span className="font-bold">User ID:</span>
                                                    <span className="col-span-3">{selectedTransaction.userId}</span>
                                                  </div>
                                                </div>
                                              )}
                                            </DialogContent>
                                          </Dialog>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Transactions;