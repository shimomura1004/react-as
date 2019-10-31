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
        let is_near = current_created_at - created_at < 1000 * 60 * 1;

        if (is_same_user && is_near) {
            buffer.push(message);
        }
        else {
            let key = buffer.map(m => m.id + m.timestamp).join();
            let tuple = [key, buffer];
            combined_messages.push(tuple);

            buffer = [message];
            screen_name = message.screen_name;
        }

        created_at = current_created_at;
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
    const ids = current_messages.map(message => message.id);

    new_messages = JSON.parse(JSON.stringify(new_messages));
    new_messages = new_messages.filter(message => !ids.includes(message.id));

    let merged_messages = [];
    while (current_messages.length > 0 && new_messages.length > 0) {
        const time1 = parseDateTime(current_messages[0].created_at);
        const time2 = parseDateTime(new_messages[0].created_at);

        if (time1 < time2) {
            merged_messages.push(current_messages.shift());
        }
        else {
            merged_messages.push(new_messages.shift());
        }
    }

    return merged_messages.concat(current_messages).concat(new_messages);
}

export const update = (message, messages) => {
    let message_id = message.id;
    return messages.map(mes => (mes.id === message_id) ? message : mes);
}

export const remove = (id, messages) => {
    return messages.filter(message => message.id !== id);
}
