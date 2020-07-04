function workoutPath(id) {
    return  `/workout/${id}`;
}

function workoutEditPath(id) {
    return  `/workout/${id}/edit`;
}

export {
    workoutPath,
    workoutEditPath
};
