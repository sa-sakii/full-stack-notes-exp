import { useState, useEffect } from 'react'
import Note from './components /Note'
import noteService from "./services/notes"
import Notification from './components /Notification'
function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  useEffect(()=>{
    noteService
      .getAll()
      .then(initialNotes => {        
        setNotes(initialNotes)
      })
  }, [])
  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random()<0.5
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(n => n.id === id ? returnedNote : n))
    })
    .catch(error => {
      setErrorMsg(`Note ${note.content} was already removed from the server`)
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }
  return(
    <div>
      <h1>Notes</h1>
      <div>
        {errorMsg ?   <Notification message={errorMsg} /> : <div></div>}
      </div>
      <div>
        <button onClick={()=>setShowAll(!showAll)}>
          Show {showAll ? "Important" : "All"}
        </button>
      </div>
      <ul>
        {
          notesToShow.map(note => 
            <Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>
          )
        }
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default App
