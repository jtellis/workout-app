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

    const NAME_MAX_LENGTH = 25;

    const REMOVE_ICON_OUTLINE = <svg fill="white" className="stroke-current text-gray-500 x-circle w-6 h-6" viewBox="0 0 24 24" ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const REMOVE_ICON = <svg className="fill-current text-gray-500 w-6 h-6" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>;
    const UP_ICON_OUTLINE = <svg fill="white" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500 arrow-circle-up w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>;
    const UP_ICON = <svg className="fill-current text-gray-500 w-6 h-6" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" /></svg>;
    const DOWN_ICON_OUTLINE = <svg fill="white" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500 arrow-circle-down w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" /></svg>;
    const DOWN_ICON = <svg className="fill-current text-gray-500 w-6 h-6" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" /></svg>

    return (
        <form className="workoutForm" autoComplete="off" onSubmit={e => handleSubmit(e, exercises, history, parentCB)}>
            <fieldset>
                <legend className="sectionLegend">Workout Details</legend>

                <div className="field">
                    <label htmlFor="name">Name</label>
                    <input
                        className="w-3/4"
                        id="name"
                        type="text"
                        name="name"
                        value={workout.name}
                        onChange={handleInputChange}
                        maxLength={NAME_MAX_LENGTH}
                        required
                    />
                </div>

                <div className="field">
                    <label className="" htmlFor="sets">Number of sets</label>
                    <input
                        className="w-1/4"
                        id="sets"
                        type="number"
                        name="sets"
                        min="1"
                        value={workout.sets}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </fieldset>

            <fieldset id="exercises">
                <legend className="sectionLegend">Exercises</legend>

                {exercises.length == 0 && <div className="m-2 p-4 bg-red-200">Please add at least one exercise to your workout.</div>}

                {
                    exercises.map(function insertExercise(exercise, idx, exercises) {
                        var nameInputId = `${exercise.id}-name`;
                        var durationInputId = `${exercise.id}-duration`;
                        return (
                            <fieldset className="exercise" key={exercise.id}>
                                <legend className="text-md">
                                    <span className="font-semibold text-gray-500">{`${idx + 1}. `}</span>
                                    <button
                                        type="button"
                                        title="Remove"
                                        onClick={() => setExercises( removeExercise(exercises, idx) )}
                                    >{REMOVE_ICON_OUTLINE}</button>

                                    {idx > 0 && <button
                                        type="button"
                                        title="Move up"
                                        onClick={() => setExercises( repositionExercise(exercises, idx, -1) )}
                                    >{UP_ICON_OUTLINE}</button>}
                                    {idx < exercises.length -1 && <button
                                        type="button"
                                        title="Move down"
                                        onClick={() => setExercises( repositionExercise(exercises, idx, 1) )}
                                    >{DOWN_ICON_OUTLINE}</button>}
                                </legend>

                                <div className="field">
                                    <label htmlFor={nameInputId}>Name</label>
                                    <input
                                        className="w-1/2"
                                        id={nameInputId}
                                        type="text"
                                        value={exercise.name}
                                        onChange={e => setExercises( renameExercise(e, exercises, idx) )}
                                        maxLength={NAME_MAX_LENGTH}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor={durationInputId}>Duration (seconds)</label>
                                    <input
                                        className="w-1/3"
                                        id={durationInputId}
                                        type="number"
                                        min="1"
                                        value={exercise.duration}
                                        onChange={e => setExercises( changeExerciseDuration(e, exercises, idx) )}
                                        required
                                    />
                                </div>
                            </fieldset>
                        );
                    })
                }

                <input
                    type="button"
                    value="Add Exercise"
                    onClick={() => setExercises( addExercise(exercises) )}
                />
            </fieldset>

            <label htmlFor="exercise-rest-duration">
                Rest between exercises (seconds)
            </label>
            <input
                id="excercise-rest-duration"
                type="number"
                name="exerciseRestDuration"
                value={workout.exerciseRestDuration}
                onChange={handleInputChange}
                required
            />
            <label htmlFor="set-rest-duration">
                Rest between sets (seconds)
            </label>
            <input 
                id="set-rest-duration"
                type="number"
                name="setRestDuration"
                value={workout.setRestDuration}
                onChange={handleInputChange}
                required
            />
    
            <input type="button" value="Cancel" onClick={cancel} />
            <input type="submit" value="Save" />
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