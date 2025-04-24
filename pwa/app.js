document.getElementById('connect').addEventListener('click', async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'Nicla' }],
      optionalServices: ['battery_service']
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('battery_service');
    const characteristic = await service.getCharacteristic('battery_level');
    characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', event => {
      const value = event.target.value.getUint8(0);
      document.getElementById('output').textContent = `Valore ricevuto: ${value}`;
    });
  } catch (err) {
    document.getElementById('output').textContent = `Errore: ${err}`;
  }
});
