console.log('service worker loaded');
// Service worker loaded
window.self.addEventListener('push', e => {
    const data = e.data.json();
    // push received
    console.log('push received');
    // show notification
    window.self.registration.showNotification(data.title, {
        body: 'Notidied By Luis',
        icon: './pomodoro-icon.png'
    })
});
    

