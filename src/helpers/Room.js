export const find_room = (rooms, key) => {
    for (var i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        if (room.id === key || room.nickname === key) {
            return room;
        }
    }
    return undefined;
};
