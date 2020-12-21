import React from 'react';
import { Link } from 'react-router-dom';
import useWorkouts from './useWorkouts';
import { workoutPath, workoutEditPath } from './paths.js';

function WorkoutList() {
    var [workouts, isLoading, isError] = useWorkouts();

    const EDIT_ICON = <svg className="w-6 h-6 fill-current text-gray-500" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;

    if (isLoading) {
        return 'Loading...';
    } else if (isError) {
        return 'Error...';
    } else {
        return (
            <ul className="exercises">
                {workouts.rows.map(function listWorkout({ doc: workout }, idx) {
                    return (
                        <li className="exercise" key={idx}>
                            <Link className="name" to={workoutPath(workout._id)}>{workout.name}</Link>
                            <Link to={workoutEditPath(workout._id)}>{EDIT_ICON}</Link>
                        </li>
                    ); 
                })}
            </ul>    
        );
    }
}

export default WorkoutList;
