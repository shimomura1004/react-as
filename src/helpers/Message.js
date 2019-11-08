const cloneJson = (json) => JSON.parse(JSON.stringify(json));
const parseDateTime = datetime => new Date(datetime.replace(/(\d)-/g, "$1/")).getTime();

export const addTimestamp = (messages, timestamp) => {
    return messages.map(m => ({
        ...m,
        created_at: parseDateTime(m.created_at),
        timestamp: timestamp
    }));
};

// todo: rename to divideIntoGroups
export const combine = messages => {
    messages = cloneJson(messages);

    if (messages.length === 0) {
        return [];
    }

    let screen_name = messages[0].screen_name;
    let created_at = messages[0].created_at;
    let buffer = [messages.shift()];
    let combined_messages = [];

    messages.forEach(message => {
        let is_gap_marker = message.gap_marker;
        let is_same_user = message.screen_name === screen_name;
        let current_created_at = message.created_at;
        let is_near = current_created_at - created_at < 1000 * 60 * 1;

        if (is_same_user && is_near && !is_gap_marker) {
            buffer.push(message);
        }
        else {
            let key = buffer.map(m => m.id + m.timestamp).join();
            combined_messages.push([key, buffer]);

            buffer = [message];
            screen_name = message.screen_name;

            if (is_gap_marker) {
                combined_messages.push(["", buffer]);
                buffer = [];
            }
        }

        created_at = current_created_at;
    });

    let key = buffer.map(m => m.id + m.timestamp).join();
    let tuple = [key, buffer];
    combined_messages.push(tuple);

    return combined_messages;
};

const detectGap = (current_messages, new_messages) => {
    if (current_messages.length === 0) {
        return false;
    }

    let latest_new_message_time = new_messages[new_messages.length - 1].created_at;
    current_messages = current_messages.filter(message => 
        latest_new_message_time > message.created_at
    );

    if (current_messages.length === 0) {
        return false;
    }

    let oldest_new_message_time = new_messages[0].created_at;
    let latest_current_message_time = current_messages[current_messages.length - 1].created_at;

    return oldest_new_message_time > latest_current_message_time;
}

export const merge = (current_messages, new_messages) => {
    current_messages = cloneJson(current_messages);
    new_messages = cloneJson(new_messages);
    const ids = current_messages.map(message => message.id);

    if (detectGap(current_messages, new_messages)) {
        let gap_marker = cloneJson(new_messages[0]);
        new_messages.unshift({...gap_marker, gap_marker: true});
    }

    new_messages = new_messages.filter(message => !ids.includes(message.id));

    let merged_messages = [];
    while (current_messages.length > 0 && new_messages.length > 0) {
        const time1 = current_messages[0].created_at;
        const time2 = new_messages[0].created_at;

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
