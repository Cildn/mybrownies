import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/context/SidebarContext";
import ApolloClientProvider from "@/provider/ApolloProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/provider/AuthProvider";
import RedirectHandler from "@/lib/zustand/redirectHandle";
import CartRedirectHandler from "@/lib/zustand/cartRedirect";

export const metadata: Metadata = {
  title: "Brownie's | A Symphony of the Senses",
  description: "Experience Euphoria. Live Comfort. Taste Satisfaction.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <ApolloClientProvider>
          <ThemeProvider>
            <SidebarProvider>
              <CartRedirectHandler/>
              <AuthProvider>
                {/* Place RedirectHandler here */}
                <RedirectHandler />
                <main className="flex-grow">{children}</main>
              </AuthProvider>
            </SidebarProvider>
          </ThemeProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
