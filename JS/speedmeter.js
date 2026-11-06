const speedElement = document.getElementById("speed");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const statusElement = document.getElementById("status");

let watchId = null;

function updateSpeed(position) {
    // speed vem em m/s; converte para km/h
    const speedMs = position.coords.speed;

    if (speedMs === null || isNaN(speedMs)) {
        speedElement.textContent = "0";
        if (statusElement) {
            statusElement.textContent = "Aguardando sinal de GPS...";
        }
        return;
    }

    const speedKmh = Math.max(0, speedMs * 3.6);
    speedElement.textContent = speedKmh.toFixed(1);

    if (statusElement) {
        statusElement.textContent = "Medindo...";
    }
}

function handleError(error) {
    let message = "Erro ao obter localização.";

    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = "Permissão de localização negada.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Localização indisponível.";
            break;
        case error.TIMEOUT:
            message = "Tempo esgotado ao buscar localização.";
            break;
    }

    if (statusElement) {
        statusElement.textContent = message;
    }

    stopTracking();
}

function startTracking() {
    if (!navigator.geolocation) {
        if (statusElement) {
            statusElement.textContent = "Geolocalização não suportada neste navegador.";
        }
        return;
    }

    startBtn.classList.add("d-none");
    stopBtn.classList.remove("d-none");

    if (statusElement) {
        statusElement.textContent = "Iniciando GPS...";
    }

    watchId = navigator.geolocation.watchPosition(updateSpeed, handleError, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
    });
}

function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    stopBtn.classList.add("d-none");
    startBtn.classList.remove("d-none");

    if (statusElement) {
        statusElement.textContent = "Parado";
    }
}

startBtn.addEventListener("click", startTracking);
stopBtn.addEventListener("click", stopTracking);
