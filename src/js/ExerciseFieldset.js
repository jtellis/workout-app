import React from 'react';
import { preventDefault } from './utils';

function ExerciseFieldset({exercise, idx, exercises, setExercises, removeExercise, repositionExercise}) {
    var nameInputId = `${exercise.id}-name`;
    var durationInputId = `${exercise.id}-duration`;
    return (
        <fieldset className="exercise" key={exercise.id}>
            <legend>
                {`Exercise ${idx + 1} `}
                <button
                    onClick={e => setExercises( preventDefault(e, removeExercise)(exercises, idx) )}
                >✖</button>

                <button
                    onClick={e => setExercises( preventDefault(e, repositionExercise)(exercises, idx, -1) )}
                >▲</button>
                <button
                    onClick={e => setExercises( preventDefault(e, repositionExercise)(exercises, idx, 1) )}
                >▼</button>
            </legend>

             <label htmlFor={nameInputId}>Name:</label>
            <input
                id={nameInputId}
                type="text"
                defaultValue={exercise.name}
            />

             <label htmlFor={durationInputId}>Duration (seconds):</label>
            <input id={durationInputId} type="number" defaultValue="30" />
        </fieldset>
    );
}

export default ExerciseFieldset;