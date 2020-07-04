function simpleRandomInt() {
    var MAX = 10000;
    return Math.floor(Math.random() * Math.floor(MAX));
}

/* HOF to seperate out event.preventDefault call */
function preventDefault(event) {
    return event.preventDefault();
}

function logError(error) {
    console.error(error);
}

export {
    simpleRandomInt,
    preventDefault,
    logError
}