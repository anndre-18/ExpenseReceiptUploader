'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '@/app/components.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [receipts, setReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState(['All Tags']);
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/');
  }, [session, status, router]);

  useEffect(() => {
    if (!session) return;

    const fetchReceipts = async () => {
      try {
        const res = await fetch('/api/receipts');
        const data = await res.json();

        console.log('Fetched receipts:', data);
        setReceipts(data);

        // Collect unique tags from string format
        const tagsSet = new Set();
        data.forEach((r) => {
          console.log('Receipt:', r.title, 'Tags:', r.tags, 'Type:', typeof r.tags);
          if (r.tags && typeof r.tags === 'string' && r.tags.trim()) {
            tagsSet.add(r.tags.trim());
          }
        });

        // Add some static tags to ensure dropdown works
        const staticTags = ['Food', 'Travel', 'Medical', 'Entertainment', 'Office', 'Business', 'Shopping', 'Education', 'Utility', 'Other'];
        staticTags.forEach(tag => tagsSet.add(tag));

        const uniqueTags = ['All Tags', ...Array.from(tagsSet)];
        console.log('Available tags for dropdown:', uniqueTags);
        setAllTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    };

    fetchReceipts();
  }, [session]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) return null;

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this receipt?')) return;
    try {
      const res = await fetch(`/api/receipts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReceipts((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const handleEdit = (receipt) => {
    const newTitle = prompt('Edit title:', receipt.title);
    if (!newTitle) return;

    fetch(`/api/receipts/${receipt._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...receipt, title: newTitle }),
    })
      .then((res) => res.json())
      .then(() => {
        setReceipts((prev) =>
          prev.map((r) => (r._id === receipt._id ? { ...r, title: newTitle } : r))
        );
      })
      .catch((err) => {
        console.error(err);
        alert('Update failed');
      });
  };

  const handleView = (receipt) => {
    setSelectedReceipt(receipt);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReceipt(null);
  };

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch = receipt.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    console.log('Filtering receipt:', receipt.title);
    console.log('Receipt tags:', receipt.tags);
    console.log('Selected tag:', selectedTag);
    
    const matchesTag =
      selectedTag === 'All Tags' ||
      (receipt.tags && receipt.tags.trim() === selectedTag.trim());
    
    console.log('Matches tag:', matchesTag);
    console.log('Matches search:', matchesSearch);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className={styles.receiptsContainer}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2>Receipt Dashboard</h2>
          <p>Manage and organize your expense receipts</p>
        </div>
        <div className={styles.receiptCount}>
          {filteredReceipts.length} receipts
        </div>
      </div>

      <div className={styles.searchFilters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Search receipts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.filterDropdown}
          value={selectedTag}
          onChange={(e) => {
            console.log('Tag selected:', e.target.value);
            setSelectedTag(e.target.value);
          }}
        >
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select className={styles.filterDropdown}>
          <option>Newest First</option>
        </select>
      </div>

      <div className={styles.receiptGrid}>
        {filteredReceipts.map((receipt) => (
          <div key={receipt._id} className={styles.receiptCard}>
            <div className={styles.receiptPreview}>
              {receipt.imageUrl ? (
                <img
                  src={receipt.imageUrl}
                  alt={receipt.title}
                  className={styles.receiptImage}
                />
              ) : (
                <span>📄</span>
              )}
            </div>

            <div className={styles.receiptContent}>
              <h3>{receipt.title}</h3>
              <p>{receipt.description}</p>

              <div className={styles.tags}>
                {receipt.tags && (
                  <span className={styles.tag}>
                    {receipt.tags}
                  </span>
                )}
              </div>

              <div className={styles.bottomRow}>
                <span className={styles.date}>{receipt.date}</span>
                <span className={styles.amount}>₹{receipt.amount}</span>
              </div>

              <div className={styles.actionButtons}>
                <button 
                  className={styles.outlinedButton}
                  onClick={() => handleView(receipt)}
                >
                  <i className="fas fa-eye"></i> View
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => handleEdit(receipt)}
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => handleDelete(receipt._id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing receipt */}
      {showModal && selectedReceipt && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedReceipt.title}</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalContent}>
              {selectedReceipt.imageUrl ? (
                <img
                  src={selectedReceipt.imageUrl}
                  alt={selectedReceipt.title}
                  className={styles.modalImage}
                />
              ) : (
                <div className={styles.noImage}>
                  <i className="fas fa-image"></i>
                  <p>No image available</p>
                </div>
              )}
              <div className={styles.modalDetails}>
                <p><strong>Description:</strong> {selectedReceipt.description}</p>
                <p><strong>Date:</strong> {selectedReceipt.date}</p>
                <p><strong>Amount:</strong> ₹{selectedReceipt.amount}</p>
                {selectedReceipt.tags && (
                  <p><strong>Tag:</strong> <span className={styles.tag}>{selectedReceipt.tags}</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
