importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');

if (workbox) {
    workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

    workbox.routing.registerRoute(
        /\.(?:png|jpg|jpeg|svg|gif)$/,
        new workbox.strategies.NetworkFirst({
            cacheName: 'image-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 20,
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                })
            ],
        })
    );

    workbox.routing.registerRoute(
        new RegExp('/api/v1/room/'),
        new workbox.strategies.NetworkFirst()
    );
}
else {
    console.log("Workbox didn't load");
}
