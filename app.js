// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAV3Ng-2Rfje54AjsKKkriCR8zTUaTXK-U",
  authDomain: "thinkairble.firebaseapp.com",
  databaseURL: "https://thinkairble-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thinkairble",
  storageBucket: "thinkairble.firebasestorage.app",
  messagingSenderId: "540804449647",
  appId: "1:540804449647:web:c64a66fcf53459886a549a"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Leggi in tempo reale da /thinkair/data
const status = document.getElementById("status");
const tempEl = document.getElementById("gauge-temp");
const humEl  = document.getElementById("gauge-hum");
const presEl = document.getElementById("gauge-pres");
const gasEl  = document.getElementById("gauge-gas");

db.ref("thinkair/data").on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    tempEl.textContent = `🌡️ Temp: ${data.T} °C`;
    humEl.textContent  = `💧 Hum:  ${data.H} %`;
    presEl.textContent = `🌬️ Press:${data.P} hPa`;
    gasEl.textContent  = `🌫️ TVOC: ${data.G} Ω`;
    status.textContent = "✅ Dati aggiornati da Firebase";
  } else {
    status.textContent = "⚠️ Nessun dato disponibile";
  }
});
