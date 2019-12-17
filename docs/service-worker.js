importScripts("precache-manifest.2d42e61e3b806cbd44719d6ebae25f38.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

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
        new RegExp('/api/v1/room/list.json'),
        new workbox.strategies.NetworkFirst()
    );
    workbox.routing.registerRoute(
        new RegExp('/api/v1/message/list.json'),
        new workbox.strategies.NetworkFirst()
    );
}
else {
    console.log("Workbox didn't load");
}

