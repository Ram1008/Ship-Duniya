import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { OrdersProvider } from "@/context/OrdersContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShipDuniya",
  description: "ShipDuniya - Your Shipping Partner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link  rel="icon" href="/shipDuniyaIcon.jpg" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <OrdersProvider>
            {children}
            <Toaster />
          </OrdersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
