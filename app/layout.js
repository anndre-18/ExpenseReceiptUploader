// app/layout.js
import SessionWrapper from './components/SessionWrapper';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Expense Receipt Uploader',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Navbar />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
