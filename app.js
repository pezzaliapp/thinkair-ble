let bleDevice;
let dataCharacteristic;

async function connectToDevice() {
  try {
    document.getElementById('statusText').textContent = "⏳ Connessione in corso...";
    bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{ name: "ThinkAir" }],
      optionalServices: ["19b10000-e8f2-537e-4f6c-d104768a1214"]
    });

    const server = await bleDevice.gatt.connect();
    const service = await server.getPrimaryService("19b10000-e8f2-537e-4f6c-d104768a1214");
    dataCharacteristic = await service.getCharacteristic("19b10001-e8f2-537e-4f6c-d104768a1214");

    dataCharacteristic.startNotifications();
    dataCharacteristic.addEventListener("characteristicvaluechanged", handleData);

    document.getElementById('statusText').textContent = "✅ Connesso a ThinkAir!";
  } catch (error) {
    document.getElementById('statusText').textContent = "❌ Connessione fallita";
    console.error(error);
  }
}

function handleData(event) {
  const value = new TextDecoder().decode(event.target.value);
  try {
    const json = JSON.parse(value);
    const temperature = parseFloat(json.T);
    updateGauge(temperature);
  } catch (err) {
    console.error("Errore parsing JSON:", err);
  }
}

let tempChart;
function updateGauge(value) {
  if (!tempChart) {
    const ctx = document.getElementById('tempGauge').getContext('2d');
    tempChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Temperatura'],
        datasets: [{
          label: 'Temperatura (°C)',
          data: [value, 50 - value],
          backgroundColor: ['#36A2EB', '#DDDDDD'],
          borderWidth: 1
        }]
      },
      options: {
        cutout: '80%',
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false }
        }
      }
    });
  } else {
    tempChart.data.datasets[0].data[0] = value;
    tempChart.data.datasets[0].data[1] = 50 - value;
    tempChart.update();
  }
}
