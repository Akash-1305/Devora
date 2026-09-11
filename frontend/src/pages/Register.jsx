import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, jsonOptions } from '../api'

export default function Register() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    setError('')
    setResult('')

    try {
      const data = await api(
        '/api/auth/register',
        jsonOptions('POST', {
          name,
          phone,
          password
        })
      )

      setResult(
        'Registration successful. You can now login using your phone number.'
      )

      setName('')
      setPhone('')
      setPassword('')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">

        <h1>Create JanSeva Account</h1>

        <form onSubmit={submit}>

          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
            }
            placeholder="Enter 10-digit phone number"
            maxLength="10"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="primary">
            Register
          </button>

        </form>

        {result && (
          <div className="success">
            {result}
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <p>
          Already registered? <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  )
}