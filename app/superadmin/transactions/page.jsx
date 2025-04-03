"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";


const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/transactions/admin");
        console.log("Transactions data : ",response.data);
        if (response.status === 200) {
          console.log(response.data);
          setTransactions(response.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);


  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Transactions</h1></CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Transection ID</TableHead>
              <TableHead className="">Amount</TableHead>
              <TableHead className="">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Current balance</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </div>
          ) : (
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction}>
                  <TableCell className="text-left font-semibold">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="text-left">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-left">
                    {format(new Date(transaction.updatedAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.status}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.balance}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                    variant="default"
                      onClick={() => handleViewDetails(transaction)}
                      className="font-semibold px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
};

export default Transactions;
