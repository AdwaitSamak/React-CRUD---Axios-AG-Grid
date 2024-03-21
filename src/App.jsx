import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Create from './comps/Create'
import Home from './comps/Home'
import Update from './comps/Update'
import Read from './comps/Read'
import 'bootstrap/dist/css/bootstrap.min.css'
import Getid from './Getid'
import GetidEdit from './GetidEdit'
import GetidDelete from './GetidDelete'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create' element={<Create/>} />
        <Route path='/update/:id' element={<Update/>} />   
        {/* we will pass an id so that we can update the record on that id */}
        <Route path='/read/:id' element={<Read/>} />
        <Route path='/getid' element={<Getid/>}/>
        <Route path='/getidedit' element={<GetidEdit/>}/>
        <Route path='/getiddelete' element={<GetidDelete/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
