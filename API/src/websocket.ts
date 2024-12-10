import WebSocket from 'ws'
import { initializeDB } from './database'

export const setupWebSocket = async () => {
  const clients: WebSocket[] = []
  const wss = new WebSocket.Server({ port: 3000 })

  wss.on('connection', async (ws) => {
    console.log('WebSocket client connected')

    const db = await initializeDB()

    const sensors = await db.all('SELECT * FROM sensor_data')
    sensors.forEach((sensor) => {
      ws.send(JSON.stringify(sensor))
    })

    ws.on('message', (message) => {
      console.log('Received:', message)
    })

    ws.on('close', () => {
      const index = clients.indexOf(ws)
      if (index !== -1) clients.splice(index, 1)
      console.log('WebSocket client disconnected')
    })
  })
}

export const broadcastMessage = (message: any) => {
  const clients: WebSocket[] = []

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}
