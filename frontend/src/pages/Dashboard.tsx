import api from '../lib/api'
import { useQuery } from '@tanstack/react-query'

export default function Dashboard() {
  const { data: forecast } = useQuery({
    queryKey: ['forecast'],
    queryFn: async () => {
      const { data } = await api.post('/ai/forecast', { series: [{ timestamp: 't0', value: 100 }], horizon: 6 })
      return data
    }
  })

  return (
    <div style={{ padding: 16 }}>
      <h2>AI Dashboard</h2>
      <div>
        <h4>Sales Forecast</h4>
        <pre>{JSON.stringify(forecast, null, 2)}</pre>
      </div>
    </div>
  )
}