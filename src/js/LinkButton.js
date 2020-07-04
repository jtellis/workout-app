import React from 'react';
import { useHistory } from 'react-router-dom';

function LinkButton({ to, children }) {

    var history = useHistory();

    return (
        <button
            type="button"
            onClick={navigate}
        >
        {children}
        </button>
    );

    function navigate() {
        history.push(to);
    }
}

export default LinkButton;