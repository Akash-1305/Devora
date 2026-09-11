import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, jsonOptions } from '../api'

export default function Login() {

  const [role, setRole] = useState('user')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    setError('')

    try {

      let path = '/api/auth/login'

      let body = {
        phone: id,
        password
      }

      if (role === 'worker') {
        path = '/api/auth/worker-login'

        body = {
          workerid: id,
          password
        }
      }

      if (role === 'admin') {
        path = '/api/auth/admin-login'

        body = {
          id,
          password
        }
      }

      const data = await api(
        path,
        jsonOptions('POST', body)
      )

      localStorage.setItem(
        'session',
        JSON.stringify(data)
      )

      if (role === 'user') {
        nav('/user')
      } else if (role === 'worker') {
        nav('/worker')
      } else {
        nav('/admin')
      }

    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="auth-shell">

      <div className="auth-card">

        <h1>JanSeva</h1>

        <p className="muted">
          Smart Civic Issue Reporting & Workforce Management
        </p>

        <div className="role-tabs">

          {['user', 'worker', 'admin'].map((r) => (

            <button
              key={r}
              className={role === r ? 'active' : ''}
              onClick={() => {
                setRole(r)
                setId('')
                setPassword('')
                setError('')
              }}
            >
              {r[0].toUpperCase() + r.slice(1)}
            </button>

          ))}

        </div>

        <form onSubmit={submit}>

          <label>
            {role === 'admin'
              ? 'Admin ID'
              : role === 'worker'
              ? 'Worker ID'
              : 'Phone Number'}
          </label>

          <input
            type={role === 'user' ? 'tel' : 'text'}
            value={id}
            onChange={(e) => {
              if (role === 'user') {
                setId(
                  e.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10)
                )
              } else {
                setId(e.target.value)
              }
            }}
            placeholder={
              role === 'user'
                ? 'Enter 10-digit phone number'
                : ''
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button className="primary">
            Login
          </button>

        </form>

        {role === 'user' && (
          <p>
            New citizen?{' '}
            <Link to="/register">
              Register here
            </Link>
          </p>
        )}

      </div>

    </div>
  )
}