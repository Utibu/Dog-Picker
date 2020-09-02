import React, { useEffect, useState } from "react"

import {socket} from "../socket"
import Voting from "./Voting"
import ConnectionLost from "./ConnectionLost"

function ConnectionContainer({location}) {
    const [isDisconnected, setIsDisconnected] = useState(false)

    useEffect(() => {
        socket.on("disconnect", () => {
            setIsDisconnected(true)
        })

        socket.on("connect", () => {
            setIsDisconnected(false)
        })
    }, [])

    if(socket.connected === false && isDisconnected === false) {
        setIsDisconnected(true)
    }

    return (
        <div>
            {isDisconnected === false ? <Voting location={location} /> : <ConnectionLost />}
        </div>
    )
}

export default ConnectionContainer