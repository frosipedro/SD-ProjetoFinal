import WebSocket from 'ws'

const clients: WebSocket[] = []

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected')
    clients.push(ws)

    ws.on('close', () => {
      const index = clients.indexOf(ws)
      if (index !== -1) clients.splice(index, 1)
      console.log('WebSocket client disconnected')
    })
  })
}

export const broadcastMessage = (message: any) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}
