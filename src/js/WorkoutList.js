import React from 'react';
import { Link } from 'react-router-dom';
import useWorkouts from './useWorkouts';
import { workoutPath, workoutEditPath } from './paths.js';

function WorkoutList() {
    var [workouts, isLoading, isError] = useWorkouts();

    if (isLoading) {
        return 'Loading...';
    } else if (isError) {
        return 'Error...';
    } else {
        return (
            <ul>
                {workouts.rows.map(function listWorkout({ doc: workout }, idx) {
                    return (
                        <li key={idx}>
                            <Link to={workoutPath(workout._id)}>{workout.name}</Link>
                            {' - '}
                            <Link to={workoutEditPath(workout._id)}>edit</Link>
                        </li>
                    ); 
                })}
            </ul>    
        );
    }
}

export default WorkoutList;
