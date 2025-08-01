import styles from '@/app/components.module.css';
import Image from 'next/image';
// import icon from '../public/icon.png'; // Replace with your actual logo image

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <header className={styles.header}>
        <div className={styles.logoSection}>
          <Image src={icon} alt="Logo" width={32} height={32} />
          <span className={styles.logoText}>Receipt Vault</span>
        </div>
        <button className={styles.githubBtn}>Login with GitHub</button>
      </header> */}

      <section className={styles.hero}>
        <h1 className={styles.title}>Receipt Tag Vault</h1>
        <p className={styles.subtitle}>
          Securely upload, organize, and manage your expense receipts with smart tagging
        </p>
        <div className={styles.ctaButtons}>
          <button className={styles.getStarted}>Get Started</button>
          <button className={styles.learnMore}>Learn More</button>
        </div>
      </section>

      
    </main>
  );
}
