import express from "express"
import http from "http"
import socketio from "socket.io"
import axios from "axios"

const PORT = process.env.PORT || 5000
const ROUNDLENGTH = 90

import router from "./router/router.js"
import {createUser, getUser, removeUser, registerVote, getUsersThatHasntVoted, getUsers, resetVotes } from "./users.js"
import { setCurrentDogs, getCurrentDogs, setLastWonDog, getLastWonDog } from "./dogs.js"
import Timer from "./Timer.js"

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router)

const defaultRoom = "default"
let timer = new Timer()
let photos


io.on("connection", (socket) => {
    console.log("User has arrived!")
    socket.on("join", (name) => {

        if(getUsers().length === 0) {
            startTimer()
        }

        createUser(socket.id, name)

        socket.join(defaultRoom)
        io.to(defaultRoom).emit("newdogs", { payload: getCurrentDogs() })
        //sendPhotos()

        const votes = getVotesPerDog("")
        io.to(defaultRoom).emit("voteCasted", votes)
        console.log("NEW USER: ", timer)
        socket.emit("newUser", { 
            lastWonDog: getLastWonDog(),
            timeLeft: timer.getTimeLeftMilliseconds()
         })
        sendUsers()
    })
    

    socket.on("vote", (dogID, callback) => {
        registerVote(socket.id, dogID)
        console.log("VOTE REGISTERED!")
        const votes = getVotesPerDog(socket.id)
        io.to(defaultRoom).emit("voteCasted", votes)
        sendUsers()
        if(timer.getTimeLeft() !== -1) {
            checkFinishedVoting()
            callback()
        }

    })

    socket.on("disconnect", () => {
        console.log("User has left!")
        removeUser(socket.id)
        sendUsers()
        if(getUsers().length === 0) timer.stopTimer()
        console.log(getUsers())
        console.log(getLastWonDog())
    })
})

function startTimer() {
    sendPhotos()
}

function sendUsers() {
    io.to(defaultRoom).emit("usersUpdated", getUsers())
}

setDogPhotoTimer()
function setDogPhotoTimer() {
    setInterval(() => {
        //io.to(defaultRoom).emit("hello", { payload: "hello" })
    }, 5000)
}

function sendPhotos() {
    getPhotos()
        .then(data => {
            //console.log(data)
            console.log("SEND PHOTOS!!")
            
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

function getPhotos() {
    //Just temporary while testing! Remember to remove before launch.
    return getDynamicPhotos()
    //return getStaticPhotos()
    
}

function getDynamicPhotos() {
    return axios.get("https://dog.ceo/api/breeds/image/random/4").
        then(response => {
            console.log(response.data)
            return response.data
        })
}

function getStaticPhotos() {
    return new Promise((resolution, reject) => {
        resolution({
            message: [
              'https://images.dog.ceo/breeds/bulldog-french/n02108915_8425.jpg',
              'https://images.dog.ceo/breeds/terrier-australian/n02096294_7000.jpg',
              'https://images.dog.ceo/breeds/bouvier/n02106382_3437.jpg',
              'https://images.dog.ceo/breeds/bouvier/n02106382_4504.jpg'
            ],
            status: 'success'
          })
    })
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
        sendUsers()
        //sendPhotos()
        startTimer()
    }, 5000)
}

function getVotesPerDog() {
    const users = getUsers()
    let allVotes = {}

    users.forEach((user) => {
        if(user.votedOn > -1) {
            const currentValue = allVotes[user.votedOn] == null ? 0 : allVotes[user.votedOn]
            allVotes[user.votedOn] = currentValue + 1
        }
    })
    console.log("VOTES: ", allVotes)
    return allVotes
}


server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))