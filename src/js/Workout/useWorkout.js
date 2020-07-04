import { useState, useEffect, useContext } from 'react';
import { logError } from '../utils';

import PouchDBContext from '../PouchDBContext';

function useWorkout(id) {

    var db = useContext(PouchDBContext);

    var [isLoading, setIsLoading] = useState(true);
    var [isError, setIsError] = useState(false);
    var [workout, setWorkout] = useState({});

    useEffect(function loadWorkout() {
        setIsLoading(true);
        setIsError(false);
    
        db
        .get(String(id))
        .then(function effects(workout) {
            setWorkout(workout);
            setIsLoading(false);
        })
        .catch(function effects(error) {
            setIsError(true);
            setIsLoading(false);
            logError(error);
        });

    }, [db, id]);

    return [workout, isLoading, isError];
}

export default useWorkout;
