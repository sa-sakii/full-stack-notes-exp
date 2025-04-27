require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === "CastError"){
        return response.status(400).send({ error: "Malformatted ID" })
    }
    else if (error.name === "ValidationError"){
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(express.json()) // json-parser in the express lib
app.use(cors())
app.use(express.static('dist'))


app.get('/', (request, response) => {
    response.send("<h1>Hello, monkeys! I am Frieza your Lord.</h1>")
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note){
            response.json(note)
        }
        else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

    
    // BEFORE MONGO
    // const id = request.params.id
    // notes = notes.filter(note => note.id !== id)
    // response.status(204).end()
})


app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (!body.content){
        return response.status(400).json({
            error: 'content missing'    
        })
    }

    const note = new Note({
        content: body.content,  
        important: body.important || false, 
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findById(request.params.id)
        .then(note => {
            if (!note){
                return response.status(404).end()
            }

            note.content = content
            note.imporant = important

            return note.save().then((updatedNote) => {
                response.json(updatedNote)
            })
        })
        .catch(error => next(error))
})

app.use(errorHandler) 

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server running on port", PORT)
})
