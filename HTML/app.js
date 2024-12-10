const sensors = {
  temperature: { name: 'Temperature', unit: '°C', history: [] },
  humidity: { name: 'Humidity', unit: '%', history: [] },
  pressure: { name: 'Pressure', unit: 'hPa', history: [] },
}

// Conecta ao WebSocket
const ws = new WebSocket('ws://localhost:3000')

ws.onopen = function (event) {
  console.log('Connected to WebSocket')
}

// Atualiza os dados na interface
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received data:', data)
  const { sensor_type, value, timestamp } = data

  if (sensors[sensor_type]) {
    // Adiciona ao histórico (limita a 5 valores)
    sensors[sensor_type].history.unshift({ value, timestamp })
    if (sensors[sensor_type].history.length > 5) {
      sensors[sensor_type].history.pop()
    }

    // Atualiza o valor atual
    const sensorDiv = document.getElementById(sensor_type)
    if (sensorDiv) {
      const currentValue = sensorDiv.querySelector('.current-value')
      if (currentValue) {
        currentValue.textContent = `${value} ${sensors[sensor_type].unit}`
        console.log(
          `Updated current value for ${sensor_type}: ${value} ${sensors[sensor_type].unit}`
        )
      } else {
        console.error(
          `Element with class 'current-value' not found in ${sensor_type} div`
        )
      }

      // Atualiza o histórico
      const historyList = sensorDiv.querySelector('.history')
      if (historyList) {
        historyList.innerHTML = sensors[sensor_type].history
          .map(
            (entry) =>
              `<li>${entry.value} ${sensors[sensor_type].unit} - ${new Date(
                entry.timestamp
              ).toLocaleTimeString()}</li>`
          )
          .join('')
        console.log(`Updated history for ${sensor_type}`)
      } else {
        console.error(
          `Element with class 'history' not found in ${sensor_type} div`
        )
      }
    } else {
      console.error(`Element with ID '${sensor_type}' not found`)
    }
  } else {
    console.error(`Sensor type '${sensor_type}' not recognized`)
  }
}
