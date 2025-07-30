'use client';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../page.module.css';

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 🔐 Always ask for account selection
  const handleLogin = () => {
    signIn('github', { prompt: 'login' }); // Forces GitHub to show account chooser
  };
  
  const handleGitHubLogin = () => {
    signIn('github', { 
      prompt: 'select_account',
      callbackUrl: '/login'
    });
  };

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Silent sign-out
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => router.push('/')}>
        EXPENSNAP
      </div>

      <div className={styles.links}>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : session ? (
          <>
            <button onClick={() => router.push('/upload')}>Upload</button>
            <button onClick={() => router.push('/receipts')}>Receipts</button>
            <button onClick={handleLogout}>Sign Out</button>
            <div className={styles.userInfo}>
              <img
                src={session.user.image}
                alt={session.user.name}
                className={styles.avatar}
              />
              <span className={styles.username}>{session.user.name}</span>
            </div>
          </>
        ) : (
          <button onClick={handleLogin}>Login with GitHub</button>
        )}
      </div>
    </nav>
  );
}
