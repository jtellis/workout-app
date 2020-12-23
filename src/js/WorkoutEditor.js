import React, { useContext, Fragment } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PouchDBContext from './PouchDBContext';
import useWorkout from './Workout/useWorkout'
import WorkoutForm from './WorkoutForm';

function WorkoutEditor() {

    var { id } = useParams();

    var db = useContext(PouchDBContext);

    var history = useHistory();

    var [workout, isLoading, isError] = useWorkout(id);

    function updateWorkout(edits) {
        db
        .put({...edits, _id: workout._id, _rev: workout._rev})
        .then(function workoutStored(workout) {
            history.push(`/workout/${workout.id}`);
        })
        .catch(function workoutStoreError(error) {
            console.error(error);
        });
    }

    if (isError) {
        return 'Error...';
    } else if (isLoading) {
        return 'Loading...';
    } else {
        return (
            <Fragment>
                <WorkoutForm workout={workout} parentCB={updateWorkout} />
                <button
                    className="neg-act-btn"
                    type="button"
                    onClick={() => remove(workout)}
                >
                    Delete {workout.name}
                </button>
            </Fragment>
        );
    }

    function remove(workout) {
        db
        .remove(workout)
        .then(function workoutRemoved() {
            history.push(`/`);
        })
        .catch(function workoutRemoveError(error) {
            console.error(error);
        });
    }
}

export default WorkoutEditor;
