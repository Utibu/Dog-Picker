class Timer {
    constructor() {
        this.timer
        this.startTime
        this.duration
        this.syncTimeout
        this.syncInterval
        console.log("RUNNING!")
    }
    /**
     * Starting (restarting if already set) a timer that performs a callback when finished. 
     * Also setting values to keep track of the progress of the timer.
     * @param {number} duration the duration in seconds.
     * @param {function} callback the function to call after timer is done.
     */
    startTimer(duration, callback) {
        if(this.timer !== null) {
            this.stopTimer()
        }

        this.timer = setTimeout(() => {
            this.stopTimer()
            if(callback !== null) callback()
        }, duration * 1000)
        const currentDate = new Date()
        this.startTime = currentDate.getTime() / 1000
        console.log("STARTING TIMER!")
        this.duration = duration
    }

    /**
     * 
     * @param {function} callback The function to be called when the timers should be synced.
     * @param {number} secondsFromZero The amount of seconds before the timer is finished that the syncing should be started.
     */
    synchronize(callback, secondsFromZero) {
        this.syncTimeout = setTimeout(() => {
            let seconds = 0
            this.syncInterval = setInterval(() => {
                if(callback !== null) callback(this.getTimeLeftMilliseconds() + 100)
                console.log(this.getTimeLeftMilliseconds())
                seconds += 1
                if(seconds >= secondsFromZero) {
                    clearInterval(this.syncInterval)
                    clearTimeout(this.syncTimeout)
                }
            }, 1000)
        }, (this.duration - secondsFromZero) * 1000)
    }

    getTimeLeft() {
        const currentDate = new Date()
        let secondsLeft = Math.floor((this.startTime + this.duration) - currentDate.getTime() / 1000)
        return secondsLeft >= 0 ? secondsLeft : -1
    }

    getTimeLeftMilliseconds() {
        const currentDate = new Date()
        let secondsLeft = Math.floor((this.startTime * 1000 + this.duration * 1000) - currentDate.getTime())
        return secondsLeft >= 0 ? secondsLeft : -1
    }

    stopTimer() {
        clearTimeout(this.timer)
        if(this.syncTimeout !== null) clearTimeout(this.syncTimeout)
        if(this.syncInterval !== null) clearInterval(this.syncInterval)
        this.timer = null
    }


}

export default Timer