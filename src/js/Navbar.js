import React from 'react';
import { Link } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import useWorkout from './Workout/useWorkout';

const CHEVRON_RIGHT = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9.3 8.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.29-3.3-3.3-3.3z"/></svg>;

function Navbar() {

    var routes = [
        {path: '/', breadcrumb: 'Workouts'},
        {path: '/workout', breadcrumb: null},
        {path: '/workout/:id', breadcrumb: WorkoutBreadcrumb}
    ];

    var breadcrumbs = useBreadcrumbs(routes);

    return (
        <ul>
             {breadcrumbs.map(function navLink({ breadcrumb, match }, idx, breadcrumbs) {
                if (idx == breadcrumbs.length-1) {
                    return <li key={match.url}>{breadcrumb}</li>;
                } else {
                    return <li key={match.url}><Link to={match.url}>{breadcrumb}</Link> {CHEVRON_RIGHT} </li>;
                }
             })}
        </ul>
    );
}

function WorkoutBreadcrumb({ match }) {

    var [workout, isLoading, isError] = useWorkout(match.params.id);

    if (isLoading || isError) {
        return match.params.id;
    } else {
        return workout.name;
    }

}

export default Navbar;