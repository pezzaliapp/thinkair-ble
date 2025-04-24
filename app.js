let device, characteristic;

async function connect() {
  try {
    document.getElementById("status").textContent = "🔄 Connessione...";
    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "ThinkAir" }],
      optionalServices: ["battery_service", "device_information", "thinkair_service"]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("thinkair_service");
    characteristic = await service.getCharacteristic("thinkair_characteristic");

    document.getElementById("status").textContent = "✅ Connesso";
    startReading();
  } catch (error) {
    document.getElementById("status").textContent = "❌ Connessione fallita";
    console.error(error);
  }
}

function startReading() {
  characteristic.startNotifications().then(() => {
    characteristic.addEventListener('characteristicvaluechanged', handleData);
  });
}

let gaugeChart, barChart;
window.onload = function () {
  const gaugeCtx = document.getElementById("gauge").getContext("2d");
  const barCtx = document.getElementById("barChart").getContext("2d");

  gaugeChart = new Chart(gaugeCtx, {
    type: 'doughnut',
    data: {
      labels: ["Temperatura", "Resto"],
      datasets: [{ data: [0, 100], backgroundColor: ["#007BFF", "#eaeaea"] }]
    },
    options: {
      cutout: '80%%',
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false }
      }
    }
  });

  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ["Temp", "Umidità", "Pressione", "TVOC"],
      datasets: [{
        label: "Valori ambientali",
        data: [0, 0, 0, 0],
        backgroundColor: "#007BFF"
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
};

function handleData(event) {
  const value = new TextDecoder().decode(event.target.value);
  try {
    const json = JSON.parse(value);
    const temp = parseFloat(json.T);
    const hum = parseFloat(json.H);
    const pres = parseFloat(json.P);
    const tvoc = parseFloat(json.G) / 1000;

    gaugeChart.data.datasets[0].data = [temp, 100 - temp];
    gaugeChart.update();

    barChart.data.datasets[0].data = [temp, hum, pres, tvoc];
    barChart.update();
  } catch (e) {
    console.error("Errore nella lettura BLE:", e);
  }
}
