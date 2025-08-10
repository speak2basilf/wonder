import { useForm } from 'react-hook-form'
import useAuth from '../state/useAuth'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

type Form = { email: string; password: string }

export default function Login() {
  const { register, handleSubmit } = useForm<Form>()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = handleSubmit(async (values) => {
    const { data } = await api.post('/auth/login', values)
    login(data.accessToken, data.roles)
    navigate('/')
  })

  return (
    <div style={{ maxWidth: 360, margin: '48px auto' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input type="email" {...register('email', { required: true })} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: true })} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}