import React, {useState} from 'react'
import {IconDocument} from '../ui/Icons'
import useFetch from "../../hooks/useFetch";
import Loading from "../ui/Loading";
import useDelete from "../../hooks/useDelete";
import secureApiFetch from "../../services/api";
import {actionCompletedToast} from "../ui/toast";
import NotesForm from "../notes/Form";
import NotesTable from "../notes/Table";

const ProjectNotesTab = ({project}) => {
    const [notes, reloadNotes] = useFetch(`/notes?parentType=project&parentId=${project.id}`)
    const deleteNoteById = useDelete('/notes/', reloadNotes)
    const emptyNote = {visibility: 'private', content: '', parentType: 'project', parentId: project.id};
    const [newNote, updateNewNote] = useState(emptyNote)

    const onDeleteButtonClick = (ev, note) => {
        ev.preventDefault();

        deleteNoteById(note.id);
    }

    const onCreateNoteFormSubmit = async (ev) => {
        ev.preventDefault();

        await secureApiFetch(`/notes`, {
            method: 'POST',
            body: JSON.stringify(newNote)
        }).then(() => {
            reloadNotes();
            actionCompletedToast(`The note has been created."`);
        })
            .finally(() => {
                updateNewNote(emptyNote)
            })
    }

    if (!notes) {
        return <Loading/>
    }

    return (
        <section>
            <h4>
                <IconDocument/>New project note
            </h4>
            <NotesForm note={newNote} onFormSubmit={onCreateNoteFormSubmit} noteSetter={updateNewNote}/>
            <h4>
                <IconDocument/>Project notes
            </h4>
            <NotesTable notes={notes} onDeleteButtonClick={onDeleteButtonClick}/>
        </section>
    )
}

export default ProjectNotesTab;
