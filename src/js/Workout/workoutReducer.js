import STATES from "./workoutStates";

function workoutReducer(state, action) {
    switch (action.type) {
        case 'WORKOUT_DOC_LOADED': {
            let intervals = enumerateIntervals(action.workoutDoc);
            let duration = calcTotalDuration(intervals);
            return updateState(state, {
                id: action.workoutDoc._id,
                name: action.workoutDoc.name,
                duration,
                intervals
            });
        }
        case 'TICK': {
            let { intervals, intervalCursor, intervalElapsedTime } = state;
            let currentInterval = intervals[intervalCursor];
            if (currentInterval.duration - intervalElapsedTime > 0) {
                return updateState(state, {
                    intervalElapsedTime: state.intervalElapsedTime + 1,
                    totalElapsedTime: state.totalElapsedTime + 1,
                });
            } else {
                if (intervalCursor < intervals.length - 1) {
                    return updateState(state, {
                        intervalCursor: intervalCursor + 1,
                        intervalElapsedTime: 0,
                    });
                } else {
                    return updateState(state, {
                        state: STATES.complete,
                        intervalCursor: intervalCursor + 1,
                    });
                }
            }
        }
        case 'START_WORKOUT':
            return updateState(state, {
                state: STATES.active,
                intervalCursor: 0,
            });
        case 'PAUSE_WORKOUT':
            return updateState(state, {
                state: STATES.inactive,
            });
        case 'RESUME_WORKOUT':
            return updateState(state, {
                state: STATES.active,
            });
        case 'RESTART_WORKOUT':
            return updateState(state, {
                state: STATES.active,
                intervalCursor: 0,
                intervalElapsedTime: 0,
                totalElapsedTime: 0,
            });
        case 'RESET_WORKOUT':
            return updateState(state, {
                state: STATES.prestart,
                intervalCursor: -1,
                intervalElapsedTime: 0,
                totalElapsedTime: 0,
            });
        default:
            throw new Error(`Unexpected action: ${action}.`);
    }
}

function updateState(state, updates) {
    return Object.assign({}, state, updates);
}

function enumerateIntervals(workout) {
    var intervals = [];

    for (let i = 0; i < workout.sets; i++) {
        for (let j = 0; j < workout.exercises.length; j++) {
            var exercise = workout.exercises[j];
            intervals.push({
                name: exercise.name,
                duration: exercise.duration,
                itemKey: intervals.length,
            });
            if (workout.exerciseRestDuration > 0) {
                if (j < workout.exercises.length - 1) {
                    intervals.push({
                        name: "Rest",
                        duration: workout.exerciseRestDuration,
                        itemKey: intervals.length,
                    });
                }
            }
        }
        if (workout.setRestDuration > 0) {
            if (i < workout.sets - 1) {
                intervals.push({
                    name: "Rest",
                    duration: workout.setRestDuration,
                    itemKey: intervals.length,
                });
            }
        }
    }

    return intervals;
}

function calcTotalDuration(intervals) {
    return intervals.reduce(function totalDurations(total, interval) {
        return total + interval.duration;
    }, 0);
}

export default workoutReducer;
