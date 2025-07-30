import React from 'react'
import Dashboard from '@/app/components/Dashboard'

const page = () => {
  return (
    <div>
      <Dashboard/>
      
    </div>
  )
}

export default page











// // View receipts page
// 'use client'
// import { useEffect, useState } from 'react'
// import styles from '../page.module.css'

// export default function ReceiptsPage() {
//   const [receipts, setReceipts] = useState([])
//   const [error, setError] = useState('')

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (!token) {
//       setError('Unauthorized access')
//       return
//     }

//     const fetchReceipts = async () => {
//       const res = await fetch('/api/receipts', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       const data = await res.json()
//       if (res.ok) {
//         setReceipts(data.receipts || [])
//       } else {
//         setError(data.message || 'Failed to fetch receipts')
//       }
//     }

//     fetchReceipts()
//   }, [])

//   return (
//     <div className={styles.receiptsPage}>
//       <h2>Your Receipts</h2>
//       {error && <p className={styles.error}>{error}</p>}
//       <ul className={styles.receiptList}>
//         {receipts.map((r) => (
//           <li key={r._id} className={styles.receiptCard}>
//             <strong>{r.title}</strong> – {r.amount} ₹ <br />
//             Type: {r.type} <br />
//             <small>{new Date(r.date).toLocaleString()}</small>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

