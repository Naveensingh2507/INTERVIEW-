import './globals.css';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'HireVault — AI Interview Prep & Resume Auditor',
  description: 'AI-powered mock interviews and resume auditing for technical careers',
}

// This script runs BEFORE React hydrates — reads localStorage and applies
// data-theme to <html> immediately, preventing any flash.
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('hv_theme');
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Blocking theme script — runs synchronously before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
