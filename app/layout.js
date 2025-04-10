import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

export const metadata = {
  title: "Green Heaven",
  description: "Shop for plants and gardening tips at Green Heaven.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
         <head>
           {/* Favicon */}
        <link rel="icon" href="/nav.png" type="image/x-icon" />
         <link
  href="https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@400;700&display=swap"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap"
  rel="stylesheet"
/>
<link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
            rel="stylesheet"
          />

        </head>
      <body>
        {/* Free Delivery Banner with custom background color */}
        <div className="bg-[#7FA15A] text-white text-2xl text-center py-6 z-10">
          <p>  🚛 Free shipping from 500 MAD!</p>
        </div>

        <Navbar />
        <div className="mt-0">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
