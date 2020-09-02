import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Voting from "./components/Voting"
import Join from "./components/Join"
import ConnectionContainer from "./components/ConnectionContainer"

function App() {
    
    return (
       <Router>
           <Route path="/vote" component={ConnectionContainer} />
           <Route exact path="/" component={Join} />
       </Router>
    )
}

export default App