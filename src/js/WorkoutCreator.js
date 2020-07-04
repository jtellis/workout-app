import React, { useContext } from 'react';
import PouchDBContext from './PouchDBContext';
import { useHistory } from 'react-router-dom';
import WorkoutForm from './WorkoutForm';

function WorkoutCreator() {

    var db = useContext(PouchDBContext);

    var history = useHistory();

    var workout = {
        name: 'Workout #1',
        sets: 1,
        exerciseRestDuration: 30,
        setRestDuration: 60,
        exercises: []
    }

    function createWorkout(createdWorkout) {
        db
        .post(createdWorkout)
        .then(function workoutStored(workout) {
            history.push(`/workout/${workout.id}`);
        })
        .catch(function workoutStoreError(error) {
            console.error(error);
        });
    }

    return <WorkoutForm workout={workout} parentCB={createWorkout} />;
}

export default WorkoutCreator;