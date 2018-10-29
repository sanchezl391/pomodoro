async function registerServiceWorker() {
    console.log('registering service worker');
    // registering service worker
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/' // url for where the service worker should work
    });

    // service worker registered
    // register push
    console.log('registering push');
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.publicVapidKey)
    });

    console.log('sending push notification');
    // send push notification
    await fetch('https://task-focus.herokuapp.com/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
        'Content-type': 'application/json; charset=utf-8'
        }
    });
}

export default registerServiceWorker;