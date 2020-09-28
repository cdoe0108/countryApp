export default function register () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            const swUrl = '/service-worker.js'
            fetch(swUrl)
            .then(response => {
                const { status = 500 } = response
                if (status === 200) {
                registerValidServiceWorker(swUrl)
                } else {
                console.log('Error loading service worker file')
                throw new Error()
                }
            })
            .catch(e => {
                console.log('Did not find service worker file', e)
            })
        })
    }
}

function registerValidServiceWorker (swUrl) {
    console.log('Registering Service Worker')
    navigator.serviceWorker.register(swUrl).then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
    }, function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
    })
}
