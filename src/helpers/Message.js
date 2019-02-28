import { List } from 'immutable';

export const combine = (messages) => {
    if (messages.size === 0) {
        return List([]);
    }

    let screen_name = messages.getIn([0, "screen_name"]);
    let buffer = List([messages.first()]);
    messages = messages.shift();
    let combined_messages = List([]);

    messages.forEach((message) => {
        if (message.get("screen_name") === screen_name) {
            buffer = buffer.push(message);
        }
        else {
            let key = buffer.map(m => m.get("id") + m.get("timestamp"));
            let tuple = List([key, buffer]);
            combined_messages = combined_messages.push(tuple);
            buffer = List([message]);
            screen_name = message.get("screen_name");
        }
    });

    let key = buffer.map(m => m.get("id") + m.get("timestamp"));
    let tuple = List([key, buffer]);
    return combined_messages.push(tuple);
};

const parseDateTime = (datetime) => {
    let result = datetime.match(/(\d\d\d\d-\d\d-\d\d) (\d\d:\d\d:\d\d)/);
    if (result === null) {
        return new Date(0);
    }
    return new Date(result[1] + "T" + result[2]);
}

export const merge = (current_messages, new_messages) => {
    let merged_messages = List([]);
    let message = undefined;
    let last_message = undefined;

    while (current_messages.size > 0 && new_messages.size > 0) {
        const time1 = parseDateTime(current_messages.getIn([0, "created_at"]));
        const time2 = parseDateTime(new_messages.getIn([0, "created_at"]));

        if (time1 < time2) {
            message = current_messages.first();
            current_messages = current_messages.shift();
        }
        else {
            message = new_messages.first();
            new_messages = new_messages.shift();
        }

        if ((last_message === undefined) || last_message.get("id") !== message.get("id")) {
            merged_messages = merged_messages.push(message);
            last_message = message;
        }
    }

    return merged_messages.concat(current_messages).concat(new_messages);
}

export const update = (message, messages) => {
    let message_id = message.get("id");
    return messages.map(mes => (mes.get("id") === message_id) ? message : mes);
}

export const remove = (id, messages) => {
    return messages.filter(message => message.get("id") !== id);
}
