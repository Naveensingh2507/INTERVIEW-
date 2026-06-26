import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'HIREVAULT',
  description: 'AI-powered interview prep and resume auditing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
