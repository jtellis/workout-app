import React from 'react';
import { Link, Redirect } from 'react-router-dom';

function NotFound() {
    return (
        <div>
            <h1>404 Page Not Found</h1>
            <h2>Redirecting to <Link to="/">/</Link></h2>
            <Redirect to="/" />
        </div>
    );
}

export default NotFound;