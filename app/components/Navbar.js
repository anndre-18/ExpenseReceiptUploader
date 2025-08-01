'use client';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../page.module.css';
// import styles from '@/app/components.module.css'

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
      callbackUrl: '/receipts'
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
          <div className={styles.cta}>
            <button onClick={() => router.push('/upload')} className={styles.navButton}>Upload</button>
            <button onClick={() => router.push('/receipts')} className={styles.navButton}>Dashboard</button>
          </div>
            <button onClick={handleLogout} className={styles.signOut}>Sign Out</button>
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
          <button onClick={handleGitHubLogin} className={styles.signIn}>Login with GitHub</button>
        )}
      </div>
    </nav>
  );
}
