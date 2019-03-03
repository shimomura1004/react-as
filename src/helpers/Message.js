export const combine = messages => {
    if (messages.size === 0) {
        return [];
    }

    let screen_name = messages[0].screen_name;
    let buffer = [messages[0]];
    messages.shift();
    let combined_messages = [];

    messages.forEach(message => {
        if (message.screen_name === screen_name) {
            buffer.push(message);
        }
        else {
            let key = buffer.map(m => m.id + m.timestamp);
            let tuple = [key, buffer];
            combined_messages.push(tuple);
            buffer = [message];
            screen_name = message.screen_name;
        }
    });

    let key = buffer.map(m => m.id + m.timestamp);
    let tuple = [key, buffer];
    combined_messages.push(tuple);
    return combined_messages;
};

const parseDateTime = datetime => {
    let result = datetime.match(/(\d\d\d\d-\d\d-\d\d) (\d\d:\d\d:\d\d)/);
    if (result === null) {
        return new Date(0);
    }
    return new Date(result[1] + "T" + result[2]);
}

export const merge = (current_messages, new_messages) => {
    let merged_messages = [];
    let message = undefined;
    let last_message = undefined;

    while (current_messages.length > 0 && new_messages.length > 0) {
        const time1 = parseDateTime(current_messages[0].created_at);
        const time2 = parseDateTime(new_messages[0].created_at);

        if (time1 < time2) {
            message = current_messages.shift();
        }
        else {
            message = new_messages.shift();
        }

        if ((last_message === undefined) || last_message.id !== message.id) {
            merged_messages.push(message);
            last_message = message;
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
