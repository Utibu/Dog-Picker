import React, { useEffect, useState } from "react"

import {socket} from "../socket"
import Voting from "./Voting"
import ConnectionLost from "./ConnectionLost"

function ConnectionContainer({location}) {
    const [isDisconnected, setIsDisconnected] = useState(false)

    useEffect(() => {
        if(socket.connected === false) {
            console.log("TRY CONNECTION!")
            socket.connect()
        } else {
            setIsDisconnected(false)
        }

        socket.on("disconnect", () => {
            console.log("DISCONNECT")
            setIsDisconnected(true)
        })

        socket.on("connect", () => {
            console.log("CONNECT")
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