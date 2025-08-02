'use client';

import styles from '@/app/components.module.css';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  const handleGetStarted = () => {
    if (!session) {
      alert('Please login to upload receipts');
      return;
    }
    window.location.href = '/upload';
  };

  const handleViewReceipts = () => {
    if (!session) {
      alert('Please login to view receipts');
      return;
    }
    window.location.href = '/receipts';
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Receipt Tag Vault</h1>
        <p className={styles.subtitle}>
          Securely upload, organize, and manage your expense receipts with smart tagging
        </p>
        <div className={styles.ctaButtons}>
          <button 
            className={styles.getStarted}
            onClick={handleGetStarted}
          >
            {session ? 'Upload Receipt' : 'Upload Receipts'}
          </button>
          <button 
            className={styles.learnMore}
            onClick={handleViewReceipts}
          >
            {session ? 'View Receipts' : 'View Receipts'}
          </button>
        </div>
      </section>
    </main>
  );
}
