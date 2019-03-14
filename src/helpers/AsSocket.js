import io from 'socket.io-client';

export default class AsSocket {
    constructor(appendMessage, updateMessage, deleteMessage) {
        this.appendMessage = appendMessage;
        this.updateMessage = updateMessage;
        this.deleteMessage = deleteMessage;
        this.socket = io.connect(`${document.as['PUSHER_SERVER']}/?app=${document.as['PUSHER_APP_KEY']}`);
        this.channels = [];
    }

    subscribe(room_id) {
        if (this.channels.indexOf(room_id) !== -1) {
            return;
        }

        console.log("subscribe " + room_id)
        this.channels.push(room_id);

        this.socket.emit("subscribe", `as-${room_id}`);
        this.socket.on("message_create", (channel, data) => {
            let message = JSON.parse(data).content;
            this.appendMessage(message);
        });
        this.socket.on("message_update", (channel, data) => {
            let message = JSON.parse(data).content;
            this.updateMessage(message);
        });
        this.socket.on("message_delete", (channel, data) => {
            var message_id = JSON.parse(data).content.id;
            this.deleteMessage(message_id, room_id);
        });
    }
}
