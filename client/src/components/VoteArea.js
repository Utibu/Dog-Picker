import React from "react"

import DogPhoto from "./DogPhoto"

function VoteArea(props) {
    
    const dogs = props.dogs.map((url, index) => {
        return (
            <DogPhoto 
                url={url} 
                key={index} 
                id={index} 
                vote={props.vote} 
                votedOn={props.votedOn === index ? true : false}
                votes={props.votes[index]}
                hasVoted={props.votedOn !== -1 ? true : false}
                useTimer={props.useTimer}
            />
        )
    })

    return (
        <div className="dogs">
            {dogs}
        </div>
    )
}

export default VoteArea