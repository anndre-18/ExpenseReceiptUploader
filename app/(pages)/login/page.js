// Login page
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/app/page.module.css'
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.token) {
        localStorage.setItem('token', data.token)
        router.push('/')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className={styles.authForm}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        
      </form>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
