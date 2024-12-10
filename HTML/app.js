const sensors = {
  temperature: { name: 'Temperature', unit: '°C', history: [] },
  humidity: { name: 'Humidity', unit: '%', history: [] },
  pressure: { name: 'Pressure', unit: 'hPa', history: [] },
}

// Conecta ao WebSocket
const ws = new WebSocket('ws://localhost:3000')

// Atualiza os dados na interface
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received data:', data)
  const { sensorType, value, timestamp } = data

  if (sensors[sensorType]) {
    // Adiciona ao histórico (limita a 5 valores)
    sensors[sensorType].history.unshift({ value, timestamp })
    if (sensors[sensorType].history.length > 5) {
      sensors[sensorType].history.pop()
    }

    // Atualiza o valor atual
    const sensorDiv = document.getElementById(sensorType)
    const currentValue = sensorDiv.querySelector('.current-value')
    currentValue.textContent = `${value} ${sensors[sensorType].unit}`

    // Atualiza o histórico
    const historyList = sensorDiv.querySelector('.history')
    historyList.innerHTML = sensors[sensorType].history
      .map(
        (entry) =>
          `<li>${entry.value} ${sensors[sensorType].unit} - ${new Date(
            entry.timestamp
          ).toLocaleTimeString()}</li>`
      )
      .join('')
  }
}
