import { setupMQTT } from './mqttClient'
import { setupWebSocket } from './websocket'
import express from 'express'
import cors from 'cors'

const startServer = async () => {
  const app = express()
  app.use(cors())

  // Configurar WebSocket
  setupWebSocket()

  // Configurar MQTT
  await setupMQTT()

  // Iniciar o servidor HTTP
  app.listen(3001, () => {
    console.log('Server running on http://localhost:3000')
  })
}

startServer().catch((err) => console.error('Error starting server:', err))
