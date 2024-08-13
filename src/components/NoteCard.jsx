import React, { useContext, useEffect, useRef, useState } from "react";
import { bodyParser, setNewOffset, setZIndex } from "../utils";
import { db } from "../appwrite/database";
import Spinner from "../icons/Spinner";
import DeleteButton from "./DeleteButton";
import { NoteContext } from "../context/NoteContext";

const NoteCard = ({ note }) => {
  const body = bodyParser(note.body);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);
  const [saving, setSaving] = useState(false);
  const { setSelectedNote } = useContext(NoteContext);

  let mouseStatePos = { x: 0, y: 0 };
  const cardRef = useRef(null);
  const keyUpTimer = useRef(null);

  const textAreaRef = useRef(null);
  //  Here use ref is used with textarea to automatically adjust its height when the contents are added
  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const autoGrow = (textAreaRef) => {
    const { current } = textAreaRef;
    current.style.height = "auto"; //Reset height
    current.style.height = current.scrollHeight + "px"; //set the new height
  };

  // mouse down is used to detect the co-ordinate
  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      setZIndex(cardRef.current);

      mouseStatePos.x = e.clientX;
      mouseStatePos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
      setSelectedNote(note);
    }
  };

  const mouseMove = (e) => {
    const mouseMoveDir = {
      x: mouseStatePos.x - e.clientX,
      y: mouseStatePos.y - e.clientY,
    };

    mouseStatePos.x = e.clientX;
    mouseStatePos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseUp", mouseUp);

    const newPos = setNewOffset(cardRef.current);
    saveData("position", newPos);
  };

  const handleKeyUp = async () => {
    //1 - Initiate "saving" state
    setSaving(true);

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };
    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className="card-header"
        style={{ color: colors.colorHeader }}
        onMouseDown={mouseDown}
      >
        <DeleteButton noteId={note.$id} />
        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <textarea
          style={{ color: colors.colorText }}
          defaultValue={body}
          ref={textAreaRef}
          onInput={() => autoGrow(textAreaRef)}
          onFocus={() => {
            setZIndex(cardRef);
            setSelectedNote(note);
          }}
          onKeyUp={handleKeyUp}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
