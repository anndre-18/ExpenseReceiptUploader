'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/components.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Page() {
  const [receipts, setReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await fetch('/api/receipts');
        const data = await res.json();
        setReceipts(data);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    };

    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter((receipt) =>
    receipt.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.receiptsContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2>Receipt Dashboard</h2>
          <p>Manage and organize your expense receipts</p>
        </div>
        <div className={styles.receiptCount}>{receipts.length} receipts</div>
      </div>

      <div className={styles.searchFilters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Search receipts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className={styles.filterDropdown}>
          <option>All Tags</option>
        </select>
        <select className={styles.filterDropdown}>
          <option>Newest First</option>
        </select>
      </div>

      <div className={styles.receiptGrid}>
        {filteredReceipts.map((receipt) => (
          <div key={receipt._id || receipt.id} className={styles.receiptCard}>
            <div className={styles.receiptPreview}>📄</div>
            <div className={styles.receiptContent}>
              <h3>{receipt.title}</h3>
              <p>{receipt.description}</p>
              <div className={styles.tags}>
                {receipt.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.bottomRow}>
                <span className={styles.date}>{receipt.date}</span>
                <span className={styles.amount}>{receipt.amount}</span>
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.outlinedButton}>
                  <i className="fas fa-eye"></i> View
                </button>
                <button className={styles.iconButton}>
                  <i className="fas fa-download"></i>
                </button>
                <button className={styles.iconButton}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
