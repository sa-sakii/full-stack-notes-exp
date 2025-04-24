const Note = ({note, toggleImportance}) => {
    const labelImp = note.important 
        ? "make not important" : "make important"
    return (
        <li className="note">
            {note.content}
            <button onClick={toggleImportance}>{labelImp}</button>
        </li>
    )
}

export default Note