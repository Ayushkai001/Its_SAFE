import React from 'react'
import Card from './components/Card.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Scroll from './components/Scroll.jsx'
function App() {
  return (
    <div>
      <Navbar/>
      <div><Hero />
      </div>
      <div><Scroll /></div>
      <Card />
    </div>
  )
}

export default App