let currentDogs = []
let lastWonDog = {}

function setCurrentDogs(arr) {
    currentDogs = arr
    return arr
}

function getCurrentDogs() {
    return currentDogs
}

function getLastWonDog() {
    return lastWonDog
}

function setLastWonDog(dog) {
    lastWonDog = dog
    return lastWonDog
}

export { setCurrentDogs, getCurrentDogs, getLastWonDog, setLastWonDog }