import React, { Fragment, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PouchDBContext from '../PouchDBContext';
import { useMachine } from '@xstate/react';
import workoutMachine from './workoutMachine';

function Workout() {
    var { id } = useParams();

    let [state, send] = useMachine(workoutMachine.withContext({
        ...workoutMachine.initialState.context,
        db: useContext(PouchDBContext),
        workoutId: id
    }));

    switch (true) {
        case (state.matches('error')):
            return 'Error...';
        case (state.matches('loading')):
            return 'Loading...';
        default: {
            return (
                <Fragment>
                    {state.matches('ready') && <h1>Ready</h1>}
                    {state.matches('running') && <h1>Running</h1>}
                    {state.matches('paused') && <h1>Paused</h1>}
                    {state.matches('complete') && <h1>Complete</h1>}
                    {` Total: ${state.context.elapsed.toFixed(1)}s / ${state.context.totalDuration.toFixed(1)}s`}
                    <br />
                    {`${state.context.intervals[state.context.intervalCursor].name}: ${state.context.intervalElapsed.toFixed(1)}s
                        /
                      ${state.context.intervals[state.context.intervalCursor].duration.toFixed(1)}s`}
                    <br />
                    {/*
                    {(workout.state == STATES.active || workout.state == STATES.inactive) && <h1>{workout.intervals[workout.intervalCursor].name}: {workout.intervals[workout.intervalCursor].duration - workout.intervalElapsedTime}</h1>}<br />
                    Total Time Remaining: {workout.duration - workout.totalElapsedTime}<br />
                    */}
                    <ul id="intervals">
                        {state.context.intervals.map(i => <li key={i.itemKey}>{i.name} ({i.duration}s)</li>)}
                    </ul>
                    {state.matches('ready') && <button type="button" onClick={() => send('START')}>Start</button>}
                    {state.matches('running') && <button type="button" onClick={() => send('PAUSE')}>Pause</button>}
                    {state.matches('paused') && <button type="button" onClick={() => send('RESUME')}>Resume</button>}
                    {['paused', 'complete'].some(state.matches) && <button type="button" onClick={() => send('RESET')}>Reset</button>}
                </Fragment>
            );
        }
    }
}

export default Workout;
