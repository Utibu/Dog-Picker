import React, { useEffect, useState } from "react"

function Timer(props) {
    const [timeLeft, setTimeLeft] = useState(-1)
    
    useEffect(() => {
        if(props.useTimer === false) {
            setTimeLeft(0)
        } else {
            setTimeLeft(Math.floor(props.initialTime / 1000))
        }

        const interval = setInterval(() => {
            setTimeLeft((state) => {
                if(state <= 1 || props.useTimer === false) {
                    clearInterval(interval)
                    return 0
                } else {
                    return state - 1
                }
            })
        }, 1000)
        
        return () => {
            clearInterval(interval)
        }
        
    }, [props.initialTime, props.useTimer])

    console.log("RENDERING: ", props.initialTime)
    return (
        <div>
            <h4>Time left: { timeLeft }</h4>
        </div>
    )
}

export default Timer