export const combine = messages => {
    messages = JSON.parse(JSON.stringify(messages))

    if (messages.length === 0) {
        return [];
    }

    let screen_name = messages[0].screen_name;
    let created_at = parseDateTime(messages[0].created_at);
    let buffer = [messages.shift()];
    let combined_messages = [];

    messages.forEach(message => {
        let is_same_user = message.screen_name === screen_name;
        let current_created_at = parseDateTime(message.created_at);
        let is_near = current_created_at - created_at < 1000 * 60 * 3;

        if (is_same_user && is_near) {
            buffer.push(message);
        }
        else {
            let key = buffer.map(m => m.id + m.timestamp).join();
            let tuple = [key, buffer];
            combined_messages.push(tuple);

            buffer = [message];
            screen_name = message.screen_name;
            created_at = current_created_at;
        }
    });

    let key = buffer.map(m => m.id + m.timestamp).join();
    let tuple = [key, buffer];
    combined_messages.push(tuple);

    return combined_messages;
};

// todo: store created_at as Date class instance
const parseDateTime = datetime => new Date(datetime.replace(/(\d)-/g, "$1/"))

export const merge = (current_messages, new_messages) => {
    current_messages = JSON.parse(JSON.stringify(current_messages));
    new_messages = JSON.parse(JSON.stringify(new_messages));

    let merged_messages = [];
    let message = undefined;
    let last_message = undefined;

    while (current_messages.length > 0 || new_messages.length > 0) {
        if(current_messages.length === 0) {
            message = new_messages.shift();
        }
        else if (new_messages.length === 0) {
            message = current_messages.shift();
        }
        else {
            const time1 = parseDateTime(current_messages[0].created_at);
            const time2 = parseDateTime(new_messages[0].created_at);

            if (time1 < time2) {
                message = current_messages.shift();
            }
            else {
                message = new_messages.shift();
            }
        }

        if ((last_message === undefined) || last_message.id !== message.id) {
            merged_messages.push(message);
            last_message = message;
        }
    }

    return merged_messages;
}

export const update = (message, messages) => {
    let message_id = message.id;
    return messages.map(mes => (mes.id === message_id) ? message : mes);
}

export const remove = (id, messages) => {
    return messages.filter(message => message.id !== id);
}
