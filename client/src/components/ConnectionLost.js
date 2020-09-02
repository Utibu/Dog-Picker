import React from "react"
import { Link } from "react-router-dom"

import {socket} from "../socket"

function ConnectionLost() {
    function reconnect() {
        socket.connect()
    }
    
    return (
        <div>
            <h1>Connection lost.</h1>
            <h3>Please click the button to try and reconnect.</h3>
            <button onClick={reconnect}>Reconnect</button>
        </div>
    )
}

export default ConnectionLost