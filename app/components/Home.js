'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/app/page.module.css'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className={styles.home}>
      <h1>Expensnap - Expense Receipt Uploader</h1>
      
      <p>A simple app to manage your expenses.</p>
      <div className={styles.homebuttons}>
        {isLoggedIn ? (
          <>
            <button onClick={() => router.push('/upload')}>Upload Receipt</button>
            <button onClick={() => router.push('/receipts')}>View Receipts</button>
          </>
        ) : (
          <>
            <button onClick={() => router.push('/login')}>Login</button>
            <button onClick={() => router.push('/register')}>Register</button>
          </>
        )}
      </div>
    </div>
  )
}
