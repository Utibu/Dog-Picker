import React from "react"

function LastWonArea(props) {

    console.log("LAST: ", Object.keys(props.dog).length)
    const content = props.dog.url !== undefined ? (
        <div>
            <img src={props.dog.url} alt="Winning dog last time" />
            <h1>Votes: {props.dog.votes}</h1>
        </div>
    ) : null

    return (
        <div>
            {content}
        </div>
    )
}

export default LastWonArea