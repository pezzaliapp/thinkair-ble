async function connect() {
  const status = document.getElementById("status");
  status.textContent = "⏳ Connessione in corso...";

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "ThinkAir" }],
      optionalServices: ["19b10010-e8f2-537e-4f6c-d104768a1214"]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("19b10010-e8f2-537e-4f6c-d104768a1214");
    const characteristic = await service.getCharacteristic("19b10011-e8f2-537e-4f6c-d104768a1214");

    status.textContent = "✅ Connesso! In attesa dati...";

    await characteristic.startNotifications();

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
    console.error(error);
    status.textContent = "❌ Connessione fallita";
  }
}
