import express from "express"
import http from "http"
import socketio from "socket.io"

const PORT = process.env.PORT || 5000
const ROUNDLENGTH = 90

import router from "./router/router.js"
import {createUser, getUser, removeUser, registerVote, getUsersThatHasntVoted, getUsers, resetVotes, getVotesPerDog } from "./users.js"
import { setCurrentDogs, getCurrentDogs, setLastWonDog, getLastWonDog } from "./dogs.js"
import Timer from "./Timer.js"
import { getPhotos } from "./services/photos.js"

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router)

const defaultRoom = "default"
let timer = new Timer()
let photos

//Handle the IO
io.on("connection", (socket) => {
    console.log("User has arrived!")
    socket.on("join", (name) => {

        //First user has joined connected, start the timer
        if(getUsers().length === 0) {
            newRound()
        }

        createUser(socket.id, name)
        socket.join(defaultRoom)

        emitOnNewUser(socket)
        
    })

    socket.on("vote", (dogID, callback) => {
        registerVote(socket.id, dogID)
        console.log("VOTE REGISTERED!")
        emitVotes(socket)
        if(callback !== null) callback()
    })

    socket.on("disconnect", () => {
        console.log("User has left!")
        removeUser(socket.id)
        emitUsers()

        //All users has left, no need for the timer to still be operating.
        if(getUsers().length === 0) timer.stopTimer()
    })
})

function emitVotes(socket) {
    const votes = getVotesPerDog(socket.id)
    io.to(defaultRoom).emit("voteCasted", votes)
    emitUsers()
    if(timer.getTimeLeft() !== -1) {
        checkFinishedVoting()
        //callback()
    }
}

function emitOnNewUser(socket) {
    io.to(defaultRoom).emit("newdogs", { payload: getCurrentDogs() })

    const votes = getVotesPerDog("")
    io.to(defaultRoom).emit("voteCasted", votes)

    socket.emit("newUser", { 
        lastWonDog: getLastWonDog(),
        timeLeft: timer.getTimeLeftMilliseconds()
    })
    
    emitUsers()
}

function newRound() {
    getPhotos()
        .then(data => {
            console.log("Sending photos!")
            
            timer.startTimer(ROUNDLENGTH, () => {
                console.log("Timer finished!")
                onFinishedVoting()
            })

            timer.synchronize((timeLeft) => {
                console.log("SYNCING IS HAPPENING!!")
                io.to(defaultRoom).emit("timerUpdated", timeLeft)
            }, 4)
            io.to(defaultRoom).emit("newdogs", { payload: data.message })
            io.to(defaultRoom).emit("timerUpdated", timer.getTimeLeftMilliseconds())

            setCurrentDogs(data.message)
        })
        .catch(err => console.log(err))
}

function emitUsers() {
    io.to(defaultRoom).emit("usersUpdated", getUsers())
}

function checkFinishedVoting() {
    if(getUsersThatHasntVoted().length === 0) {
        onFinishedVoting()
    } 
}

function onFinishedVoting() {
    let counts = getUsers().reduce((total, currentObject) => {
        total[currentObject.votedOn] = (total[currentObject.votedOn] || 0) + 1
        return total
    }, {})
    //Find the item with the largest count (most amount of votes)
    let maxCount = Math.max(...Object.values(counts));
    //Check the array and get the items with the same amount of votes as the max vote was found to be
    let mostFrequent = Object.keys(counts).filter(index => counts[index] === maxCount);
    //If a tie, always grab the first one
    const wonIndex = mostFrequent[0]
    handleVoteReset()
    const dog = { url: getCurrentDogs()[wonIndex], votes: maxCount }
    setLastWonDog(dog)
    io.to(defaultRoom).emit("finished", dog)
    console.log("DOG THAT WON: ", dog)
}

function handleVoteReset() {
    timer.stopTimer()
    setTimeout(() => {
        io.to(defaultRoom).emit("reset")
        resetVotes()
        emitUsers()
        //sendPhotos()
        newRound()
    }, 5000)
}


server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))