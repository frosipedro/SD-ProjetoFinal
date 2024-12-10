import http from 'http'
import { setupMQTT } from './mqttClient'
import { setupWebSocket } from './websocket'

const startServer = async () => {
  const server = http.createServer()

  // Configurar WebSocket
  setupWebSocket(server)

  // Configurar MQTT
  await setupMQTT()

  // Iniciar o servidor HTTP
  server.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
  })
}

startServer().catch((err) => console.error('Error starting server:', err))
