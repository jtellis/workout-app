import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { genSimpleUID } from './utils';

function WorkoutForm({ workout: initial, parentCB }) {

    var history = useHistory();

    var initialExercises;
    if (initial.exercises.length > 0) {
        initialExercises = initial.exercises;
    } else {
        initialExercises = addExercise([]);
    }
    var [exercises, setExercises] = useState( initialExercises );
    var [workout, setWorkout] = useState({
        name: initial.name,
        sets: initial.sets,
        exerciseRestDuration: initial.exerciseRestDuration,
        setRestDuration: initial.setRestDuration
    });

    return (
        <form autoComplete="off" onSubmit={e => handleSubmit(e, exercises, history, parentCB)}>
            <fieldset>
                <legend>Workout Details</legend>

                <label htmlFor="name">Name:</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={workout.name}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="sets">Number of sets:</label>
                <input
                    id="sets"
                    type="number"
                    name="sets"
                    min="1"
                    value={workout.sets}
                    onChange={handleInputChange}
                    required
                />
            </fieldset>

            <fieldset id="exercises">
                <legend>Exercises</legend>

                {exercises.length == 0 && 'Please add at least one exercise to your workout.'}

                {
                    exercises.map(function insertExercise(exercise, idx, exercises) {
                        var nameInputId = `${exercise.id}-name`;
                        var durationInputId = `${exercise.id}-duration`;
                        return (
                            <fieldset className="exercise" key={exercise.id}>
                                <legend>
                                    {`Exercise ${idx + 1} `}
                                    <button
                                        type="button"
                                        onClick={() => setExercises( removeExercise(exercises, idx) )}
                                    >✖</button>

                                    <button
                                        type="button"
                                        onClick={() => setExercises( repositionExercise(exercises, idx, -1) )}
                                    >▲</button>
                                    <button
                                        type="button"
                                        onClick={() => setExercises( repositionExercise(exercises, idx, 1) )}
                                    >▼</button>
                                </legend>

                                 <label htmlFor={nameInputId}>Name:</label>
                                <input
                                    id={nameInputId}
                                    type="text"
                                    value={exercise.name}
                                    onChange={e => setExercises( renameExercise(e, exercises, idx) )}
                                    required
                                />

                                 <label htmlFor={durationInputId}>Duration (seconds):</label>
                                <input 
                                    id={durationInputId}
                                    type="number"
                                    min="1"
                                    value={exercise.duration}
                                    onChange={e => setExercises( changeExerciseDuration(e, exercises, idx) )}
                                    required
                                />
                            </fieldset>
                        );
                    })
                }

                <input
                    type="button"
                    value="➕ New Exercise"
                    onClick={() => setExercises( addExercise(exercises) )}
                />
            </fieldset>

            <fieldset>
                <legend>Rest between exercises</legend>

                <label htmlFor="exercise-rest-duration">
                    Duration (seconds)
                </label>
                <input
                    id="excercise-rest-duration"
                    type="number"
                    name="exerciseRestDuration"
                    value={workout.exerciseRestDuration}
                    onChange={handleInputChange}
                    required
                />
            </fieldset>

            <fieldset>
                <legend>Rest between sets</legend>

                <label htmlFor="set-rest-duration">
                    Duration (seconds)
                </label>
                <input 
                    id="set-rest-duration"
                    type="number"
                    name="setRestDuration"
                    value={workout.setRestDuration}
                    onChange={handleInputChange}
                    required
                />
            </fieldset>

            <input type="submit" value="Save" />
            <input type="button" value="Cancel" onClick={cancel} />
        </form>
    );

    function cancel() {
        history.goBack();
    }

    function handleInputChange(event) {
        var { name, value } = event.target;
        setWorkout(Object.assign({}, workout, { [name]: value }));
    }

    function addExercise(exercises) {
        var newExercise = {
            id: `exercise-${genSimpleUID()}`,
            name: `Exercise ${exercises.length + 1}`,
            duration: 30,
        };
        return [...exercises, newExercise];
    }

    function removeExercise(exercises, idx) {
        exercises = [...exercises];
        exercises.splice(idx, 1);
        return exercises;
    }

    function repositionExercise(exercises, idx, positionOffset) {
        var newIdx;
        if (idx + positionOffset < 0) {
            newIdx = 0;
        } else if (idx + positionOffset > exercises.length - 1)  {
            newIdx = exercises.length - 1;
        } else {
            newIdx = idx + positionOffset;
        }
        
        if(newIdx == idx) {
            return exercises;
        } else {
            exercises = [...exercises];
            var swapTemp = exercises[idx];
            exercises[idx] = exercises[newIdx];
            exercises[newIdx] = swapTemp;

            return exercises;
        }
    }

    function handleSubmit(event, exercises, history, parentCB) {
        event.preventDefault();

        if (exercises.length == 0) return;

        var form = event.target;

        var newWorkout = createWorkout(form, exercises);

        parentCB(newWorkout);

    }
}

function createWorkout(form, exercises) {

    var input = new FormData(form);

    var newWorkout = {
        name: input.get('name'),
        sets: Number( input.get('sets') ),
        exerciseRestDuration: Number( input.get('excercise-rest-duration') ),
        setRestDuration: Number( input.get('set-rest-duration') ),
        exercises: exercises.map(function castDurationToNumber(exercise) {
            exercise.duration = Number(exercise.duration);
            return exercise;
        })
    };

    return newWorkout;
}

function renameExercise(event, exercises, idx) {
    exercises = [...exercises];
    exercises[idx].name = event.target.value;
    return exercises;
}

function changeExerciseDuration(event, exercises, idx) {
    exercises = [...exercises];
    exercises[idx].duration = event.target.value;
    return exercises;
}


export default WorkoutForm;