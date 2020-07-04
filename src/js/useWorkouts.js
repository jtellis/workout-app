import { useState, useEffect, useContext } from 'react';

import PouchDBContext from './PouchDBContext';

function useWorkouts() {

    var db = useContext(PouchDBContext);

    var [isLoading, setIsLoading] = useState(true);
    var [isError, setIsError] = useState(false);
    var [workouts, setWorkouts] = useState({});

    useEffect(function loadWorkouts() {
        setIsLoading(true);
        setIsError(false);
    
        db
        .allDocs({ include_docs: true })
        .then(function effects(workouts) {
            setWorkouts(workouts);
            setIsLoading(false);
        })
        .catch(function effects(error) {
            setIsError(true);
            setIsLoading(false);
            console.error(error);
        });

    }, [db]);

    return [workouts, isLoading, isError];
}

export default useWorkouts;
