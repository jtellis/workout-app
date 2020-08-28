import { createMachine, assign } from 'xstate';
import intervalMachine from './intervalMachine';

export default createMachine(
    {
        initial: 'ready',
        context: {
            intervals: [],
            intervalCursor: 0,
            elapsed: 0,
            timerInterval: 1
        },
        states: {
            ready: {
                on:{
                    START: 'running'
                }
            },
            running: {
                invoke: {
                    id: 'intervalMachine',
                    src: 'intervalMachine',
                    data: {
                        interval: ctx => ctx.timerInterval,
                        elapsed: 0,
                        duration: ctx => ctx.intervals[ctx.intervalCursor].duration
                    },
                    onDone: {
                        target: 'running',
                        actions: 'updateCurrentInterval'
                    }
                },
                always: {
                    target: 'complete',
                    cond: 'allIntervalsComplete'
                },
                on: {
                    INTERVAL_TICK: {
                        actions: 'incrementElapsed'
                    }
                }
            },
            paused: {},
            complete: { type: 'final' }
        }
    },
    { /* config */
        actions: {
            updateCurrentInterval: assign({
                intervalCursor: ctx => ctx.intervalCursor + 1
            }),
            incrementElapsed: assign({
                elapsed: ctx => ctx.elapsed + ctx.timerInterval
            })
        },
        guards: {
            allIntervalsComplete: ctx => ctx.intervalCursor === ctx.intervals.length
        },
        services: {
            intervalMachine
        }
    }
);