import io from 'socket.io-client';
import { PUSHER_SERVER, PUSHER_APP_KEY } from '../config';

export default class AsSocket {
    constructor(appendMessageInView, updateMessageInView, deleteMessageInView, websocketConnected, websocketDisconnected) {
        this.appendMessageInView = appendMessageInView;
        this.updateMessageInView = updateMessageInView;
        this.deleteMessageInView = deleteMessageInView;
        this.socket = io.connect(`${PUSHER_SERVER}/?app=${PUSHER_APP_KEY}`);
        this.channels = [];
        this.once_connected = false;

        let self = this;
        this.socket.on('connect', () => {
            websocketConnected();

            if (!self.once_connected) {
                self.once_connected = true;
                return;
            }

            for (var i=0; i < this.channels.length; i++) {
                console.log(`reconnecting as-${self.channels[i]}`)
                self.socket.emit("subscribe", `as-${self.channels[i]}`);
            }
        });
        this.socket.on('disconnect', websocketDisconnected);

        setInterval((socket => () => {
            if (socket.disconnected) {
                socket.connect();
            }
        })(this.socket), 1000);
    }

    subscribe(room_id) {
        if (this.channels.indexOf(room_id) !== -1) {
            return;
        }

        console.log("subscribe " + room_id)
        this.channels.push(room_id);

        // todo: survey keima behavior
        // subscribing other channel causes duplicated message notification?
        this.socket.emit("subscribe", `as-${room_id}`);
        this.socket.on("message_create", (channel, data) => {
            let message = JSON.parse(data).content;
            this.appendMessageInView(message);
        });
        this.socket.on("message_update", (channel, data) => {
            let message = JSON.parse(data).content;
            this.updateMessageInView(message);
        });
        this.socket.on("message_delete", (channel, data) => {
            var message_id = JSON.parse(data).content.id;
            this.deleteMessageInView(message_id, room_id);
        });
    }
}
