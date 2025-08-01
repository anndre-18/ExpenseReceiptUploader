'use client';

import { useState } from 'react';
import styles from '@/app/components.module.css'; // updated import

export default function UploadReceiptPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !type) {
      setMessage('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Upload successful!');
        setFile(null);
        setPreview(null);
        setType('');
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
          Receipt Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className={styles.uploadInput}
          />
        </label>

        <label className={styles.uploadLabel}>
          Receipt Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className={styles.uploadInput}
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
