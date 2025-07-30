import './globals.css'
import Navbar from './components/Navbar'
import SessionWrapper from './components/SessionWrapper'

export const metadata = {
  title: 'Expense Receipt Uploader',
  description: 'A simple app to manage expenses',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionWrapper>
      <body>
        <Navbar />
        {children}
      </body>
      </SessionWrapper>
    </html>
  )
}
