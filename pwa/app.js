document.getElementById('connect').addEventListener('click', async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: 'ThinkAir' }],
      optionalServices: ['19b10010-e8f2-537e-4f6c-d104768a1214']
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('19b10010-e8f2-537e-4f6c-d104768a1214');
    const characteristic = await service.getCharacteristic('19b10011-e8f2-537e-4f6c-d104768a1214');

    characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', event => {
      const jsonString = new TextDecoder().decode(event.target.value);
      let dati;

      try {
        dati = JSON.parse(jsonString);
      } catch (e) {
        document.getElementById('output').textContent = "⚠️ Dato ricevuto non valido: " + jsonString;
        return;
      }

      document.getElementById('output').innerHTML =
        `🌡️ Temperatura: ${dati.T} °C<br>` +
        `💧 Umidità: ${dati.H} %<br>` +
        `🌬️ Pressione: ${dati.P} hPa<br>` +
        `🌫️ Gas (TVOC/CO₂eq): ${dati.G} Ω`;
    });

    document.getElementById('output').textContent = "🔗 Connesso! In attesa dei dati...";
  } catch (err) {
    console.error(err);
    document.getElementById('output').textContent = `❌ Errore: ${err}`;
  }
});
