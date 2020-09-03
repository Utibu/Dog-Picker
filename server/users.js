const users = []

/*
    { id, votedOn }
*/

function createUser(id, name) {
    return users.push({ id, name, votedOn: -1})
}

function getUser(id) {
    const user = users.find((user) => user.id === id)

    if(user != null) {
        return user
    }
}

function removeUser(id) {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

function registerVote(id, votedOn) {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users[index].votedOn = votedOn
    }
}

function getUsersThatHasntVoted() {
    return users.filter((user) => user.votedOn === -1)
}

function getUsers() {
    return users
}

function getVotesPerDog() {
    let allVotes = {}

    users.forEach((user) => {
        if(user.votedOn > -1) {
            const currentValue = allVotes[user.votedOn] == null ? 0 : allVotes[user.votedOn]
            allVotes[user.votedOn] = currentValue + 1
        }
    })
    
    return allVotes
}

function resetVotes() {
    users.forEach(user => {
        user.votedOn = -1
    })
}

export {createUser, getUser, removeUser, registerVote, getUsersThatHasntVoted, getUsers, resetVotes, getVotesPerDog }