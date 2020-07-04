function workoutPath(id) {
    return  `/workout/${id}`;
}

function workoutEditPath(id) {
    return  `/workout/${id}/edit`;
}

function workoutDeletePath(id) {
    return  `/workout/${id}/delete`;
}

export {
    workoutPath,
    workoutEditPath,
    workoutDeletePath
};
