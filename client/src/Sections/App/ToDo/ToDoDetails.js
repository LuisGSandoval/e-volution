import React, { useState, useContext, useEffect } from 'react';
import { CTX } from '../../../Store/Store';
import { Tooltip } from 'reactstrap';
import {
  getNoteDetails,
  deleteNote,
  setNoteToFinished,
} from '../../../Actions/NotesActions';
import PriorityBagde from '../../../Components/PriorityBagde';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ToDoDetails = () => {
  const [store, dispatch] = useContext(CTX);
  const [editToolTip, setEditToolTip] = useState(false);
  const [deleteToolTip, setDeleteToolTip] = useState(false);
  const [checkTooltip, setCheckTooltip] = useState(false);
  const { noteId, noteDetails, notes } = store;

  const toggleEditToolTip = () => setEditToolTip(!editToolTip);
  const toggleDeleteToolTip = () => setDeleteToolTip(!deleteToolTip);
  const toggleCheckToolTip = () => setCheckTooltip(!checkTooltip);

  const toggleUpdateMode = () => {
    dispatch({ type: 'ACTIVATE_UPDATE_MODE', payload: true });
    dispatch({ type: 'NOTE_FORM_UPDATE', payload: noteDetails });
  };

  const toggleCheck = (id, finishedTask) => {
    setNoteToFinished({ id, finishedTask })
      .then((data) => {
        dispatch({ type: 'UPDATE_TOAST_MESSAGE', payload: data });
        let newNotes = notes.map((note) => {
          if (note._id === id) {
            return data.data;
          }
          return note;
        });

        console.log('despues de checkar se recibe', data);
        dispatch({ type: 'LOAD_NOTE_DETAILS', payload: data.data });

        dispatch({
          type: 'LOAD_NOTE_LIST',
          payload: newNotes,
        });

        // dispatch({ type: 'MODAL_TOGGLE', payload: false });
      })
      .catch((err) => {
        dispatch({ type: 'UPDATE_TOAST_MESSAGE', payload: err });
        console.log(err);
      });
  };

  const removeNote = () => {
    deleteNote(noteId)
      .then((data) => {
        let newNotes = notes.filter((note) => note._id !== noteId);
        dispatch({ type: 'LOAD_NOTE_LIST', payload: newNotes });

        dispatch({ type: 'UPDATE_TOAST_MESSAGE', payload: data });
        dispatch({ type: 'MODAL_TOGGLE', payload: false });
      })
      .catch((err) => {
        dispatch({ type: 'UPDATE_TOAST_MESSAGE', payload: err });
      });
  };

  useEffect(() => {
    getNoteDetails(noteId)
      .then((data) => {
        dispatch({ type: 'LOAD_NOTE_DETAILS', payload: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch, noteId]);

  return (
    <div className="container">
      <div className="row">
        {/* options */}
        <div className="col-12">
          <div className="d-flex justify-content-atart">
            <h3>
              {noteDetails && noteDetails.finishedTask
                ? 'Terminada'
                : 'Pendiente'}
            </h3>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className={`btn mr-2 btn-${
                noteDetails && noteDetails.finishedTask ? 'success' : 'light'
              }`}
              id="toggleCheck"
              onClick={() =>
                toggleCheck(noteDetails._id, noteDetails.finishedTask)
              }
            >
              <i
                className={`fa fa-check-square ${
                  noteDetails && noteDetails.finishedTask
                    ? 'text-white'
                    : 'text-ligh'
                }`}
              />
            </button>
            <Tooltip
              placement="top"
              isOpen={checkTooltip}
              target="toggleCheck"
              toggle={toggleCheckToolTip}
            >
              {noteDetails && noteDetails.finishedTask
                ? 'terminada'
                : 'sin terminar'}
            </Tooltip>

            <button
              className="btn btn-primary mr-2"
              id="editButton"
              onClick={toggleUpdateMode}
            >
              <i className="fa fa-edit" />
            </button>
            <Tooltip
              placement="top"
              isOpen={editToolTip}
              target="editButton"
              toggle={toggleEditToolTip}
            >
              Editar nota
            </Tooltip>

            <button
              className="btn btn-danger"
              id="deleteNote"
              onClick={removeNote}
            >
              <i className="fa fa-trash" />
            </button>
            <Tooltip
              placement="top"
              isOpen={deleteToolTip}
              target="deleteNote"
              toggle={toggleDeleteToolTip}
            >
              Eliminar nota
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mt-4">
            <div className="card-body">
              {noteDetails && (
                <>
                  <span>
                    <span className="text-muted">Prioridad: </span>
                    <PriorityBagde priority={noteDetails.priority} />
                  </span>
                  <br />
                  <span>
                    <span className="text-muted">Fecha de realización: </span>
                    {noteDetails.executionDate &&
                      format(
                        new Date(noteDetails.executionDate),
                        'dd MMMM yyyy',
                        {
                          locale: es,
                        }
                      )}
                  </span>
                  <br />
                  <span>
                    <span className="text-muted">Fecha de creación: </span>
                    {noteDetails.executionDate &&
                      format(
                        new Date(noteDetails.dateRegistered),
                        'dd MMMM yyyy',
                        {
                          locale: es,
                        }
                      )}
                  </span>
                  {noteDetails.finishedDate && (
                    <>
                      <br />
                      <span>
                        <span className="text-muted">Terminada el: </span>
                        {noteDetails.finishedDate &&
                          format(
                            new Date(noteDetails.finishedDate),
                            'dd MMMM yyyy',
                            {
                              locale: es,
                            }
                          )}
                      </span>
                    </>
                  )}

                  <br />
                  <span>
                    <span className="text-muted">Título: </span>
                    {noteDetails.title}
                  </span>
                  <br />
                  <div>
                    {noteDetails.description && (
                      <>
                        <span className="text-muted">Description: </span>
                        <br />
                        {noteDetails.description
                          .split('\n')
                          .map((item, key) => {
                            return (
                              <span key={key}>
                                {item}
                                <br />
                              </span>
                            );
                          })}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoDetails;
