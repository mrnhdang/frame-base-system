import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Frame-Based Diagnosis Demo",
  description: "Frames for knowledge representation (PIP/Internist-1 style)"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-5xl mx-auto p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Frame-Based Medical Diagnosis (Demo)</h1>
            <p className="text-gray-600">Prototype matching on disease frames with findings and rules.</p>
          </header>
          {children}
          <footer className="mt-10 text-xs text-gray-500">Demo for educational use.</footer>
        </div>
      </body>
    </html>
  );
}
