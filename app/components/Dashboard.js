'use client';
import styles from '@/app/page.module.css';
import { useRouter } from 'next/navigation';

export default function Dashboard({ receipts = [] }) {
  const router = useRouter();

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Dashboard Page</h2>

      <div className={styles.main}>
        <div className={styles.receiptContainer}>
          {receipts.map((receipt, index) => (
            <div className={styles.receiptCard} key={index}>
              <img src={receipt.image || '/placeholder.png'} alt="receipt" />
              <div className={styles.receiptInfo}>
                <p>{receipt.title}</p>
                <p>{receipt.amount}</p>
                <p>{receipt.type}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sidebar}>
          <button onClick={() => router.push('/upload')}>Upload Receipts</button>
          <div className={styles.totalBox}>
            Total Receipts: {receipts.length}
          </div>
        </div>
      </div>
    </div>
  );
}
