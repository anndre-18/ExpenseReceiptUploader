// Register page
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../page.module.css'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.token) {
        localStorage.setItem('token', data.token)
        router.push('/')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className={styles.authForm}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
