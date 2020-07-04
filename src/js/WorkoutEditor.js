import React, { useContext, Fragment } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PouchDBContext from './PouchDBContext';
import useWorkout from './Workout/useWorkout'
import WorkoutForm from './WorkoutForm';
import { workoutDeletePath } from './paths';
import LinkButton from './LinkButton';

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
                <LinkButton to={workoutDeletePath(id)}>DELETE</LinkButton>
            </Fragment>
        );
    }
}

export default WorkoutEditor;