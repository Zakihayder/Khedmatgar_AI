import type { Metadata } from "next";
import "./globals.css";
import { JudgeModeButton } from "@/components/ui/JudgeModeButton";
import { Navbar } from "@/components/ui/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Khedmatgar AI (خدمتگار) — Apni Zaroorat Batao",
  description: "Pakistan's first agentic service orchestration platform. Powered by Google Antigravity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen font-sans">
        <Navbar />
        {children}
        <JudgeModeButton />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#111B35', color: '#fff', border: '1px solid rgba(0,212,255,0.3)' },
          success: { iconTheme: { primary: '#00FF88', secondary: '#0A0F1E' } },
          error: { iconTheme: { primary: '#FF3B5C', secondary: '#0A0F1E' } },
        }} />
      </body>
    </html>
  );
}
