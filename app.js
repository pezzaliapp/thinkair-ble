/*  ThinkAir BLE – app.js (funziona in Bluefy e Chrome desktop)  */
const SERVICE_UUID = "19b10010-e8f2-537e-4f6c-d104768a1214";
const CHAR_UUID    = "19b10011-e8f2-537e-4f6c-d104768a1214";

async function connect() {
  const status = document.getElementById("status");
  status.textContent = "⏳ Connessione in corso…";
  try {
    const device = await navigator.bluetooth.requestDevice({
      /* servizio inside filters → iOS consente l’accesso */
      filters: [{ namePrefix: "ThinkAir", services: [SERVICE_UUID] }],
      optionalServices: [SERVICE_UUID]
    });

    const server        = await device.gatt.connect();
    const service       = await server.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHAR_UUID);

    status.textContent = "✅ Connesso! In arrivo dati…";
    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", handleData);

  } catch (err) {
    console.error(err);
    status.textContent = "❌ " + (err.message || "Connessione fallita");
  }
}

/* ---- parser compatto “T:21.4,H:45,P:1008,G:8400” ---- */
function parseCompact(str) {
  const o = {};
  str.split(",").forEach(p => {
    const [k, v] = p.split(":");
    o[k] = Number(v);
  });
  return o;   // {T:…, H:…, P:…, G:…}
}

function handleData(evt) {
  const str = new TextDecoder().decode(evt.target.value);
  const d   = parseCompact(str);

  document.getElementById("gauge-temp").textContent = `🌡️ Temp: ${d.T} °C`;
  document.getElementById("gauge-hum").textContent  = `💧 Hum:  ${d.H} %`;
  document.getElementById("gauge-pres").textContent = `🌬️ Press:${d.P} hPa`;
  document.getElementById("gauge-gas").textContent  = `🌫️ TVOC: ${d.G} Ω`;

  /* eventuale bridge nativo */
  if (typeof window.onBleJson === "function") window.onBleJson(d);
}
