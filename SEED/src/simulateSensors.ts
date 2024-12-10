import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://localhost:1883')

// Simula valores aleatórios para diferentes sensores
const simulateSensorData = () => {
  const sensors = [
    { topic: 'sensors/temperature', min: 20, max: 30 },
    { topic: 'sensors/humidity', min: 40, max: 70 },
    { topic: 'sensors/pressure', min: 1000, max: 1020 },
  ]

  sensors.forEach((sensor) => {
    const value = (
      Math.random() * (sensor.max - sensor.min) +
      sensor.min
    ).toFixed(2)
    client.publish(sensor.topic, value)
    console.log(`Published ${value} to ${sensor.topic}`)
  })
}

// Publica dados a cada 5 segundos
setInterval(simulateSensorData, 5000)
