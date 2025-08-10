import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export default function Leads() {
  const qc = useQueryClient()
  const { data } = useQuery({ queryKey: ['leads'], queryFn: async () => (await api.get('/leads')).data })
  const scoreMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/leads/${id}/score`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] })
  })

  return (
    <div style={{ padding: 16 }}>
      <h2>Leads</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Source</th><th>Expected</th><th>Score</th><th></th></tr>
        </thead>
        <tbody>
          {data?.map((l: any) => (
            <tr key={l.id}>
              <td>{l.id.slice(0,8)}...</td>
              <td>{l.source}</td>
              <td>{l.expected_value}</td>
              <td>{l.score ?? '-'}</td>
              <td><button onClick={() => scoreMutation.mutate(l.id)}>Score</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}