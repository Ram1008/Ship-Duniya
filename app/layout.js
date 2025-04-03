import "./globals.css";

export const metadata = {
  title: "Ship Duniya",
  description: "Your one-stop shipping and logistics platform.", // Update with your actual description
  icons: {
    icon: "/ShipDuniyaIcon.jpg"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {children}
      </body>
    </html>
  );
}
