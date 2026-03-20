import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
