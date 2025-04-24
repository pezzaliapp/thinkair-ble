/*  ThinkAir BLE – app.js
 *  Funziona su Chrome desktop, Bluefy (iOS) e qualunque browser Web-Bluetooth.
 *  Lo sketch Arduino/Nicla deve usare gli stessi UUID.
 */
const SERVICE_UUID = "19b10010-e8f2-537e-4f6c-d104768a1214";
const CHAR_UUID    = "19b10011-e8f2-537e-4f6c-d104768a1214";

async function connect() {
  const status = document.getElementById("status");
  status.textContent = "⏳ Connessione in corso…";

  try {
    /* 1. Scansione + pairing */
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          namePrefix: "ThinkAir",
          services: [SERVICE_UUID]          // 🔑 iOS/Bluefy lo richiede anche qui
        }
      ],
      optionalServices: [SERVICE_UUID]       // ok anche su Chrome desktop
    });

    /* 2. Connessione GATT */
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHAR_UUID);

    status.textContent = "✅ Connesso! In attesa dati…";

    /* 3. Notifiche in tempo reale */
    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", handleData);

  } catch (err) {
    console.error(err);
    status.textContent = "❌ " + (err.message || "Connessione fallita");
  }
}

/* ------------------------------------------------------------------ */

function handleData(event) {
  const jsonStr = new TextDecoder().decode(event.target.value);

  try {
    const d = JSON.parse(jsonStr);

    /* Aggiorna la UI */
    document.getElementById("gauge-temp").textContent = `🌡️ Temp: ${d.T} °C`;
    document.getElementById("gauge-hum").textContent  = `💧 Hum: ${d.H} %`;
    document.getElementById("gauge-pres").textContent = `🌬️ Press: ${d.P} hPa`;
    document.getElementById("gauge-gas").textContent  = `🌫️ TVOC: ${d.G} Ω`;

    /* Se l’app è incapsulata in un wrapper nativo, inoltra il JSON */
    if (typeof window.onBleJson === "function") {
      window.onBleJson(d);
    }

  } catch {
    const status = document.getElementById("status");
    status.textContent = "⚠️ Errore nei dati ricevuti";
  }
}
