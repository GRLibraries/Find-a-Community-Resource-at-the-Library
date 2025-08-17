<<<<<<< HEAD
/**
 * Service Worker for Community Resources Finder
 * 
 * Provides offline functionality and caching for better performance.
 * Caches essential resources and enables the app to work without internet.
 */

const CACHE_NAME = 'community-resources-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/script.js',
    '/styles.css',
    '/security-implementation.js',
    '/lib/leaflet.js',
    '/lib/leaflet.css',
    '/lib/qrcode.js',
    '/lib/work-sans.css',
    '/assets/images/logo.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
            .catch(() => {
                // Fallback for offline HTML requests
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
