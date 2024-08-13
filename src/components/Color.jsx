import React, { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/database";

const Color = ({ color }) => {
  const { selectedNote, notes, setNotes } = useContext(NoteContext);

  const changeColor = async () => {
    try {
      const currentNoteIndex = notes.findIndex(
        (note) => note.$id === selectedNote.$id
      );

      const updatedNote = {
        ...notes[currentNoteIndex],
        colors: JSON.stringify(color),
      };

      const newNotes = [...notes];
      newNotes[currentNoteIndex] = updatedNote;
      setNotes(newNotes);

      await db.notes.update(selectedNote.$id, {
        colors: JSON.stringify(color),
      });
    } catch {
      console.log("you must select a note before changing colors");
    }
  };

  return (
    <div
      onClick={changeColor}
      className="color"
      style={{ backgroundColor: color.colorHeader }}
    ></div>
  );
};

export default Color;
