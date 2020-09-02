import React from "react"

function DogPhoto(props) {

    function handleClick(event) {
        if(props.useTimer) {
            console.log("CLICKED ON DOG " + props.url)
            props.vote(props.id)
        }
    }

    const items = []
    let votes = props.votes
    if(votes !== null) {
        if(props.votedOn === true) votes--
        for(let i = 0; i < votes; i++) {
            items.push(
                <div>❤️</div>
            )
        }
    }
    

    return (
        <div className={`dogContainer ${props.hasVoted === false && props.useTimer === true ? "hoverable" : ""}`}>
            <img src={props.url} alt="dog" onClick={handleClick} />
            <div className="info">
                <span className="hoverIcon">❤️</span>
                { props.votedOn ? <span className="like">❤️</span> : null}
                {items}
            </div>
            
        </div>
    )
}

export default DogPhoto