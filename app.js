async function connect() {
  const status = document.getElementById("status");
  status.textContent = "⏳ Connessione in corso...";
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "ThinkAir" }],
      optionalServices: ["12345678-1234-5678-1234-56789abcdef0"]
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("12345678-1234-5678-1234-56789abcdef0");
    const characteristic = await service.getCharacteristic("12345678-1234-5678-1234-56789abcdef1");

    status.textContent = "✅ Connesso! In attesa dati...";

    characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", (event) => {
      const json = new TextDecoder().decode(event.target.value);
      try {
        const data = JSON.parse(json);
        document.getElementById("gauge-temp").textContent = `🌡️ Temp: ${data.T} °C`;
        document.getElementById("gauge-hum").textContent = `💧 Hum: ${data.H} %`;
        document.getElementById("gauge-pres").textContent = `🌬️ Press: ${data.P} hPa`;
        document.getElementById("gauge-gas").textContent = `🌫️ TVOC: ${data.G} Ω`;
      } catch {
        status.textContent = "⚠️ Errore nei dati ricevuti.";
      }
    });
  } catch (error) {
    status.textContent = "❌ Connessione fallita";
  }
}
