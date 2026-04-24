import "./globals.css";

export const metadata = {
  title: "Brevet Sales Simulation",
  description: "A live exercise in the four motions of modern selling. Presented by Brevet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
