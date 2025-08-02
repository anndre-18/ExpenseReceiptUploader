'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from '@/app/components.module.css';

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo}>ExpeneSnap</div>
        <div className={styles.loading}>Loading...</div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        ExpenSnap
      </Link>

      <div className={styles.links}>
        {session ? (
          <>
            <Link href="/upload" className={styles.navButton}>
              <i className="fas fa-upload"></i> Upload
            </Link>
            <Link href="/receipts" className={styles.navButton}>
              <i className="fas fa-receipt"></i> Dashboard
            </Link>
            <div className={styles.userInfo}>
              
              <img
                src={session.user.image}
                alt={session.user.name}
                className={styles.avatar}
              />
              
              <span className={styles.username}>
                {session.user?.name || session.user?.email || 'User'}
              </span>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutButton}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </>
        ) : (
          <button onClick={() => signIn()} className={styles.loginButton}>
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        )}
      </div>
    </nav>
  );
}
