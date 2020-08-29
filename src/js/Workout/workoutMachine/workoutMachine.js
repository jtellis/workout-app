import { createMachine, assign } from 'xstate';
import intervalMachine from './intervalMachine';

export default createMachine(
    {
        initial: 'loading',
        context: {
            /*
            db,
            workoutId,
            intervals,
            */
            intervalCursor: 0,
            elapsed: 0,
            intervalElapsed: 0,
            timerInterval: 0.1
        },
        states: {
            loading: {
                invoke: {
                    id: 'getWorkout',
                    src: 'getWorkout',
                    onDone: {
                        target: 'ready',
                        actions: [
                            'assignIntervals',
                            'assignTotalDuration'
                        ]
                    },
                    onError: 'error'
                }
            },
            error: {},
            ready: {
                on:{
                    START: 'running'
                }
            },
            running: {
                invoke: {
                    cond: () => false,
                    id: 'intervalMachine',
                    src: 'intervalMachine',
                    data: {
                        timerInterval: ctx => ctx.timerInterval,
                        elapsed: 0,
                        duration: ctx => ctx.intervals[ctx.intervalCursor].duration
                    },
                    onDone: [
                        {
                            target: 'complete',
                            cond: 'allIntervalsComplete'
                        },
                        {
                            target: 'running',
                            actions: [
                                'updateCurrentInterval',
                                'resetIntervalElapsed'
                            ]
                        }
                    ]
                },
                on: {
                    INTERVAL_TICK: {
                        actions: [
                            'incrementElapsed',
                            'incrementIntervalElapsed'
                        ]
                    },
                    PAUSE: 'paused'
                }
            },
            paused: {
                on: {
                    RESUME: 'running',
                    RESET: 'reset'
                }
            },
            reset: {
                always: {
                    target: 'ready',
                    actions: 'restoreReadyContext'
                }
            },
            complete: {
                on: {
                    RESET: 'reset'
                }
            }
        }
    },
    { /* config */
        actions: {
            updateCurrentInterval: assign({
                intervalCursor: ctx => ctx.intervalCursor + 1
            }),
            incrementElapsed: assign({
                elapsed: ctx => fixedFloat(ctx.elapsed + ctx.timerInterval)
            }),
            incrementIntervalElapsed: assign({
                intervalElapsed: ctx => fixedFloat(ctx.intervalElapsed + ctx.timerInterval)
            }),
            assignIntervals: assign({
                intervals: (ctx, e) => enumerateIntervals(e.data)
            }),
            assignTotalDuration: assign({
                totalDuration: ctx => ctx.intervals.reduce((t, i) => t + i.duration, 0)
            }),
            resetIntervalElapsed: assign({
                intervalElapsed: 0
            }),
            restoreReadyContext: assign({
                intervalCursor: 0,
                elapsed: 0,
                intervalElapsed: 0
            })
        },
        guards: {
            allIntervalsComplete: ctx => ctx.intervalCursor === ctx.intervals.length - 1
        },
        services: {
            getWorkout: ctx => ctx.db.get(String(ctx.workoutId)),
            intervalMachine
        }
    }
);

function fixedFloat(n) {
    return parseFloat((n).toFixed(2))
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