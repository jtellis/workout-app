import React, { Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PouchDB from 'pouchdb-browser';
import PouchDBContext from './PouchDBContext';

import NotFound from './NotFound';
import WorkoutCreator from './WorkoutCreator';
import Workout from './Workout';
import WorkoutEditor from './WorkoutEditor';
import LinkButton from './LinkButton';
import WorkoutList from './WorkoutList';
import Navbar from './Navbar';

var db = new PouchDB('appDB');

render(
    <React.StrictMode>
        <PouchDBContext.Provider value={db}>
            <Router>
                <Navbar />
                <div className="w-full max-w-md mx-auto">
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
                    <Route exact path="/">
                            {/* https://pouchdb.com/api.html#batch_fetch */}
                            <WorkoutList />
                            <LinkButton className="bg-green-400 text-gray-800 font-semibold cursor-pointer mb-6 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight" to="/workout/new">New Workout</LinkButton>
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
                </div>
            </Router>
        </PouchDBContext.Provider>
    </React.StrictMode>,
    document.getElementById("app")
);
