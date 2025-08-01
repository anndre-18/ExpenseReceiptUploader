'use client';

import { useState } from 'react';
import styles from '@/app/components.module.css';

export default function UploadReceiptPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !description || !tags || !date || !amount) {
      setMessage('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags); // comma-separated
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
        setTags('');
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
          Tags (comma-separated):
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={styles.uploadInput}
            required
          />
        </label>

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
