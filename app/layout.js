import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import AuthGuard from "@/components/AuthGuard";

export const metadata = {
  title: "Citizen Dashboard | Karnataka Urban Digital Twin",
  description: "Live interactive dashboard for Karnataka citizens with real-time city data, civic forms, and AI assistance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Kannada:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <AuthGuard>
            <div className="layout-wrapper">
              <Navigation />
              <main className="main-content">
                {children}
              </main>
            </div>
          </AuthGuard>
        </LanguageProvider>
      </body>
    </html>
  );
}
