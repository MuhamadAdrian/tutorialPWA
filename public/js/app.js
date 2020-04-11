if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
    .then((reg) => console.log('service registered', reg))
    .catch((err) => console.log('service not registered'. err))
}