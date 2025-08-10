import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export default function Contacts() {
  const { data } = useQuery({ queryKey: ['contacts'], queryFn: async () => (await api.get('/contacts')).data })
  return (
    <div style={{ padding: 16 }}>
      <h2>Contacts</h2>
      <ul>
        {data?.map((c: any) => (
          <li key={c.id}>{c.first_name} {c.last_name} - {c.email}</li>
        ))}
      </ul>
    </div>
  )
}