import mqtt from 'mqtt'
import { initializeDB } from './database'
import { broadcastMessage } from './websocket'

export const setupMQTT = async () => {
  const db = await initializeDB()
  const client = mqtt.connect('mqtt://localhost:1883')

  client.on('connect', () => {
    console.log('Connected to MQTT broker')
    client.subscribe('sensors/#') // Inscrevendo-se em todos os tópicos sob "sensors/"
  })

  client.on('message', async (topic, message) => {
    const value = message.toString()
    const timestamp = Date.now()
    const sensorType = topic.split('/')[1] // Exemplo: "temperature", "humidity", "pressure"

    // Salvar no banco de dados
    await db.run(
      `INSERT INTO sensor_data (topic, sensor_type, value, timestamp) VALUES (?, ?, ?, ?)`,
      [topic, sensorType, value, timestamp]
    )

    // Enviar para o WebSocket
    broadcastMessage({ topic, sensorType, value, timestamp })
    console.log(`Received and saved: ${topic} - ${value}`)
  })

  return client
}
