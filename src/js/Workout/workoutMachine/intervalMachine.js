import { createMachine, assign, sendParent } from 'xstate';

    /*
        https://xstate.js.org/docs/tutorials/7guis/timer.html#modeling
        https://spectrum.chat/statecharts/general/is-there-a-way-to-clear-an-interval-without-transitioning-to-another-state~252813ff-22aa-4d62-bb7f-9d8198afd8d9?m=MTU5NjYzNjAwNzcwOA==
    */

const ONE_SECOND = 1000; /* 1sec = 1000ms */

export default createMachine(
    {
        initial: 'running',
        context: {
            /*
            duration,
            timerInterval,
            elapsed
            */
        },
        states: {
            running: {
                invoke: {
                    id: 'timer',
                    src: 'timer'
                },
                always: {
                    target: 'complete',
                    cond: 'intervalComplete'
                },
                on: {
                    TICK: {
                        actions: [
                            sendParent('INTERVAL_TICK'),
                            'incrementElapsed'
                        ]
                    },
                    PAUSE: 'paused'
                }
            },
            paused: {
                on: {
                    RESUME: 'running'
                }
            },
            complete: { type: 'final' }
        }
    },
    { /* config */
        actions: {
            incrementElapsed: assign({
                elapsed: ctx => fixedFloat(ctx.elapsed + ctx.timerInterval)
            })
        },
        guards: {
            intervalComplete: ctx => ctx.elapsed === ctx.duration
        },
        services: {
            timer: (ctx) => sendBack => {
                let interval = setInterval(() => {
                    sendBack('TICK');
                }, ONE_SECOND * ctx.timerInterval);
            
                return () => {
                    clearInterval(interval);
                };
            }
        }
    }
);

function fixedFloat(n) {
    return parseFloat((n).toFixed(2))
}