class NotificationService {
    constructor() {
        this.notificationSound = new Audio('/sounds/notification.mp3');
        this.notificationPermission = false;
        this.initialize();
    }

    async initialize() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
        }
    }

    playNotificationSound() {
        this.notificationSound.play().catch(err => {
            console.warn('Could not play notification sound:', err);
        });
    }

    showNotification(title, options = {}) {
        if (this.notificationPermission && document.hidden) {
            this.playNotificationSound();
            return new Notification(title, {
                icon: '/notification-icon.png',
                badge: '/notification-badge.png',
                ...options,
            });
        }
    }

    async requestPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
            return this.notificationPermission;
        }
        return false;
    }
}

export const notificationService = new NotificationService(); 