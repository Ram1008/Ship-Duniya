'use client';

import { useState, useEffect } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import axiosInstance from '@/utils/axios';
import Cookies from 'js-cookie';
import TransactionSuccessMessage from '@/components/custom/TransactionSuccessMessage';

export default function WalletWithRazorpay() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [amount, setAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWalletBalance = async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      if (response.status === 200 && response.data.wallet) {
        setWalletBalance(response.data.wallet);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axiosInstance.post('/payment/create', { amount });

      if(amount < 500){
        alert('Minimum amount to add is ₹500');
        return;
      }
  
      if (response.status === 200) {
        const { id, amount: responseAmount, currency } = response.data;
        setOrderId(id);
  
        const options = {
          // Use your production/live Razorpay key here.
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: responseAmount,
          currency: currency,
          name: 'ShipDuniya',
          description: `Add ₹${amount} to wallet`,
          order_id: id,
          handler: async function (response) {
            try {
              const validateResponse = await axiosInstance.post('/payment/verify', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
  
              if (validateResponse.status === 200) {
                const updateFormPaymentStatus = await axiosInstance.post('/payment/update', {
                  orderId: validateResponse.data.orderId,
                  paymentId: validateResponse.data.paymentId,
                  amount: responseAmount / 100,
                  currency,
                });
                if (updateFormPaymentStatus.status === 201) {
                  fetchWalletBalance();
                  setIsSuccessDialogOpen(true);
                  setIsOpen(false);
                } else {
                  alert('Error updating wallet balance');
                }
              } else {
                alert('Payment verification failed!');
              }
            } catch (error) {
              console.error('Error in payment handler:', error);
              alert('An error occurred while processing your payment.');
            }
          },
          theme: {
            color: '#3399cc',
          },
        };
  
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
  
        paymentObject.on('payment.failed', function (response) {
          console.log(response);
          alert('Payment failed. Please try again.');
        });
      } else {
        console.error('Error creating Razorpay order');
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => console.error('Failed to load Razorpay script')}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="px-2.5 py-2 rounded-lg bg-primary text-primary-foreground flex items-center cursor-pointer transition-colors">
            <Wallet className=" h-4 w-4 mr-2" />
            <span className=" font-semibold">
              {loading ? (
                <Loader2 className="animate-spin h-8 w-8" color="white" />
              ) : (
                `Balance: ₹ ${walletBalance.toFixed(2)}`
              )}
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your Wallet</DialogTitle>
            <DialogDescription className="text-lg">
              Your current wallet balance is shown below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {loading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : (
              <p className="text-4xl font-bold text-center text-primary">
                ₹{walletBalance.toFixed(2)}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount to add (₹)
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full"
              placeholder="Enter amount > 500"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handlePayment}
              className="w-full text-lg py-6"
            >
              Add ₹{amount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <TransactionSuccessMessage />
        </DialogContent>
      </Dialog>
    </>
  );
}
