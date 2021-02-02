import React, { Fragment, useEffect, useState } from 'react';
import { Column, Button } from "rbx";
import "../../styles/notes.scss"
import { push as Menu } from 'react-burger-menu'
import List from '../notes/list/index'
import Editor from "../notes/editor";
import NotesService from '../../services/notes'


function Notes(props) {
    const [notes, setNotes] = useState([]);
    const [current_note, setCurrentNote] = useState({ title: "", body: "", id: "" });

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        const response = await NotesService.index();
        if (response.data.length >= 1) {
            setNotes(response.data.reverse())
            setCurrentNote(response.data[0])
        } else {
            setNotes([])
        }
    }
    const createNote = async (params) => {
        const note = await NotesService.create();
        fetchNotes();
    }
    const deleteNote = async (note) => {
        await NotesService.delete(note._id);
        fetchNotes();
    }

    const selectNote = (id) => {
        const note = notes.find((note) => {
            return note._id == id;
        })
        setCurrentNote(note);
    }

    return (
        <Fragment>
            <div className="notes" id="notes">
                <Menu
                    pageWrapId={"notes-editor"}
                    isOpen={props.isOpen}
                    onStateChange={(state) => props.setIsOpen(state.isOpen)}
                    disableAutoFocus
                    outerContainerId={"notes"}
                    customBurgerIcon={false}
                    customCrossIcon={false}
                >

                    <Column.Group>
                        <Column size={10} offset={1}>
                            Search...
                        </Column>
                    </Column.Group>
                    <List
                        notes={notes}
                        selectNote={selectNote}
                        deleteNote={deleteNote}
                        createNote={createNote}
                        current_note={current_note} />
                </Menu>


                <Column size={12} className="notes-editor" id="notes-editor">
                    <Editor
                        note={current_note}
                    />
                </Column>
            </div>
        </Fragment>
    )
}

export default Notes