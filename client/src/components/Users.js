import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import {socket} from "../socket"

function Users(props) {
    const [users, setUsers] = useState([])

    useEffect(() => {
        socket.on("usersUpdated", (sentUsers) => {
            console.log("SETTING USERS")
            setUsers(() => sentUsers)
        }) 
    }, [])

    const userElements = users.map(users => {
        return <li>{users.name} - has voted: {users.votedOn === -1 ? "No" : "Yes"}</li>
    })
    
    return (
        <div className="users">
            <h2>Users currently voting</h2>
            <ul>
                {userElements}
            </ul>
        </div> 
    )
}

export default Users