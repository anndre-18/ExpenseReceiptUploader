'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '@/app/components.module.css';

const STATIC_TAGS = ["Food", "Travel", "Medical", "Entertainment", "Office", "Business", "Shopping", "Education", "Utility", "Other"]


export default function UploadReceiptPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [customTags, setCustomTags] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  // Authentication check - must be first useEffect
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !description || !selectedTag || !date || !amount) {
      setMessage('Please fill all fields including tag selection');
      return;
    }

    console.log('Submitting with tag:', selectedTag);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', selectedTag); // Send as simple string
    formData.append('date', date);
    formData.append('amount', amount);
    formData.append('receipt', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Upload successful!');
        setTitle('');
        setDescription('');
        setSelectedTag('');
        setCustomTags('');
        setDate('');
        setAmount('');
        setFile(null);
        setPreview(null);
      } else {
        setMessage(data.error || '❌ Upload failed');
      }
    } catch (err) {
      setMessage('⚠️ Server error');
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h2 className={styles.uploadHeading}>Upload Expense Receipt</h2>
      <form onSubmit={handleSubmit} className={styles.uploadForm} encType="multipart/form-data">
        <label className={styles.uploadLabel}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.uploadInput}
            required
          />
        </label>

        <label className={styles.uploadLabel}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.uploadInput}
            required
          />
        </label>

        <label className={styles.uploadLabel}>
          Select a Tag:
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className={styles.uploadInput}
            required
          >
            <option value="">-- Select a Tag --</option>
            {STATIC_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        {/* <label className={styles.uploadLabel}>
          Additional Tags (comma-separated):
          <input
            type="text"
            value={customTags}
            onChange={(e) => setCustomTags(e.target.value)}
            className={styles.uploadInput}
            placeholder="e.g. groceries, taxi"
          />
        </label> */}

        <label className={styles.uploadLabel}>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.uploadInput}
            required
          />
        </label>

        <label className={styles.uploadLabel}>
          Amount:
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.uploadInput}
            required
          />
        </label>

        <label className={styles.uploadLabel}>
          Receipt Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.uploadInput}
            required
          />
        </label>

        {preview && (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
          </div>
        )}

        <button type="submit" className={styles.uploadButton}>Upload</button>
      </form>

      {message && <p className={styles.uploadMessage}>{message}</p>}
    </div>
  );
}
