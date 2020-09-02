import React, { useState } from "react"
import { Link } from "react-router-dom"

function Join() {
    const [name, setName] = useState("")

    return (
        <div>
            <input type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Name: " />
            <Link onClick={event => !name ? event.preventDefault() : null} to={`/vote?name=${name}`}>Go voting!</Link>
        </div>
    )
}

export default Join