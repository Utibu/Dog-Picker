import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import queryString from "query-string"

import VoteArea from "./VoteArea"
import LastWonArea from "./LastWonArea"
import Users from "./Users"
import Timer from "./Timer"

import {socket} from "../socket"
import "../style.scss"

function Voting({location}) {
    const ENDPOINT = "http://localhost:5000"
    const [newDogs, setNewDogs] = useState([])
    const [votedOn, setVotedOn] = useState(-1)
    const [lastWonDog, setLastWonDog] = useState({})
    const [votes, setVotes] = useState({})
    const [initialTime, setInitialTime] = useState(0)
    const [useTimer, setUseTimer] = useState(true)

    useEffect(() => {
        //socket = io(ENDPOINT)
        const { name } = queryString.parse(location.search)
        socket.emit("join", name)
        //use dog api
        socket.on("newUser", (payload) => {
            setLastWonDog(payload.lastWonDog)
            setInitialTime(payload.timeLeft)
        })
    }, [location.search])

    useEffect(() => {
        socket.on("newdogs", ({payload, timer}) => {
            console.log(payload)
            setNewDogs(payload)
            //setInitialTime(timer)
        })

        socket.on("finished", (dogVoteObject) => {
            console.log(dogVoteObject)
            setLastWonDog(dogVoteObject)
            setUseTimer(false)
        })

        socket.on("reset", () => {
            setVotedOn(-1)
            setVotes({})
            setUseTimer(true)
        })

        socket.on("timerUpdated", (timeLeft) => {
            setInitialTime(timeLeft)
        })

        //A vote was casted by a user, recieves all votes
        socket.on("voteCasted", (recievedVotes) => {
            setVotes(recievedVotes)
        })
    }, [])

    function vote(id) {
        //User has not voted yet.
        if(votedOn === -1) {
            socket.emit("vote", id, () => console.log("VOTED!"))
            setVotedOn(id)
        }
    }

    console.log("LAST WON DOG:", lastWonDog)
    console.log("INITIAL TIME: ", initialTime)
    
    return (
        <main>
            <article>
                <h1>Vote!</h1>
                <VoteArea 
                    dogs={newDogs}
                    vote={vote}
                    votedOn={votedOn}
                    votes={votes}
                    useTimer={useTimer}
                />
                <Timer initialTime={initialTime} useTimer={useTimer} />
            </article>
            
            <aside>
                <LastWonArea dog={lastWonDog} />
                <Users />
            </aside>
        </main>
        
    )
}

export default Voting