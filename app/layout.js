export const metadata = {
  title: "Rent Management",
  description: "Rent Management App"
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
