console.log('service worker loaded');
// Service worker loaded
self.addEventListener('push', e => {
    const data = e.data.json();
    // push received
    console.log('push received');
    // show notification
    self.registration.showNotification(data.title, {
        body: 'Your break is here! Make the most of it!',
        icon: './pomodoro-icon.png'
    })
});
    


