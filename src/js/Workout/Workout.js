import React, {useEffect, Fragment, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import useWorkout from './useWorkout';
import STATES from './workoutStates';
import workoutReducer from './workoutReducer';

function Workout() {
    const ONE_SECOND = 1000; /* 1sec = 1000ms */

    var { id } = useParams();

    var [workoutDoc, workoutDocLoading, workoutDocError] = useWorkout(id);

    var initialState = {
        id: '',
        name: '',
        duration: 0,
        intervals: [],
        state: STATES.prestart,
        totalElapsedTime: 0,
        intervalCursor: -1,
        intervalElapsedTime: 0
    }    

    var [workout, dispatch] = useReducer(workoutReducer, initialState);

    useEffect(function tick() {
        if (workout.state == STATES.active) {
            var tickInterval = setInterval(function schedule() {
                dispatch({type: 'TICK'});
            }, ONE_SECOND);
            return function cleanup() {
                clearInterval(tickInterval);
            };
        }
    }, [workout.state, dispatch]);

    useEffect(function() {
        if (workoutDoc && !workoutDocLoading && !workoutDocError) {
            dispatch({
                type: 'WORKOUT_DOC_LOADED',
                workoutDoc
            });
        }
    }, [workoutDoc, workoutDocLoading, workoutDocError, dispatch]);

    if (workoutDocError) {
        return 'Error...';
    } else if (workout.intervals.length == 0) {
        return 'Loading...';
    } else {
        return (
            <Fragment>
                {workout.state == STATES.prestart && <h1>Ready</h1>}
                {(workout.state == STATES.active || workout.state == STATES.inactive) && <h1>{workout.intervals[workout.intervalCursor].name}: {workout.intervals[workout.intervalCursor].duration - workout.intervalElapsedTime}</h1>}<br />
                Total Time Remaining: {workout.duration - workout.totalElapsedTime}<br />
                {intervalsList(workout)}
                {workout.state == STATES.complete && <h1>Complete</h1>}
                {workout.state == STATES.prestart && <button type="button" onClick={start}>Start</button>}
                {workout.state == STATES.active && <button type="button" onClick={pause}>Pause</button>}
                {workout.state == STATES.inactive && <button type="button" onClick={resume}>Resume</button>}
                {workout.state == STATES.complete && <button type="button" onClick={restart}>Restart</button>}
                {workout.state == STATES.inactive && <button type="button" onClick={reset}>Reset</button>}
            </Fragment>
        );
    }

    function intervalsList(workout) {
        var intervalItems = workout.intervals.map(function createItem(interval, idx) {
            var className;
            if (idx < workout.intervalCursor) {
                className = 'past';
            } else if (idx == workout.intervalCursor) {
                className = 'present';
            } else {
                className = 'future';
            }
            return <li className={className} key={idx}>{interval.name} ({interval.duration})</li>;
        });
        return (
            <ul id="intervals">
                {intervalItems}
            </ul>
        );
    }

    function start() {
        dispatch({type: 'START_WORKOUT'});
    }

    function pause() {
        dispatch({type: 'PAUSE_WORKOUT'});
    }

    function resume() {
        dispatch({type: 'RESUME_WORKOUT'});
    }

    function restart() {
        dispatch({type: 'RESTART_WORKOUT'});
    }

    function reset() {
        dispatch({type: 'RESET_WORKOUT'});
    }
}

export default Workout;
