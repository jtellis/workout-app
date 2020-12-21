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
                    className="bg-red-400 text-gray-800 font-semibold cursor-pointer mb-6 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight"
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
