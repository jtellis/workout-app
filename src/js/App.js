import React, { Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import PouchDB from 'pouchdb-browser';
import PouchDBContext from './PouchDBContext';
import seedData from './seedData';

import NotFound from './NotFound';
import WorkoutCreator from './WorkoutCreator';
import Workout from './Workout';
import WorkoutEditor from './WorkoutEditor';
import LinkButton from './LinkButton';
import WorkoutList from './WorkoutList';

var db = new PouchDB('appDB');

db.put(seedData, {force: true}).catch(err => err.name === 'conflict' ? undefined : console.error(err));

render(
    <React.StrictMode>
        <PouchDBContext.Provider value={db}>
            <Router>
                <Switch>
                    <Route exact path="/workout/new">
                        <WorkoutCreator />
                    </Route>
                    <Route exact path="/workout/:id">
                        <Workout />
                    </Route>
                    <Route exact path="/workout/:id/edit">
                        <WorkoutEditor />
                    </Route>
                    <Route exact path="/workout/:id/delete">
                        {/* redirect temporarily */}
                        <Redirect to="/" />
                    </Route>
                    <Route exact path="/">
                        <Fragment>
                            {/* https://pouchdb.com/api.html#batch_fetch */}
                            <WorkoutList />
                            <LinkButton to="/workout/new">New Workout</LinkButton>
                        </Fragment>
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </PouchDBContext.Provider>
    </React.StrictMode>,
    document.getElementById("app")
);
