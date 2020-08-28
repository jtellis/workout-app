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
            elapsed: 0,
            duration: 0,
            interval: 1
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
                elapsed: cxt => cxt.elapsed + cxt.interval
            })
        },
        guards: {
            intervalComplete: cxt => cxt.elapsed === cxt.duration
        },
        services: {
            timer: () => sendBack => {
                let interval = setInterval(() => {
                    sendBack('TICK');
                }, ONE_SECOND);
            
                return () => {
                    clearInterval(interval);
                };
            }
        }
    }
);