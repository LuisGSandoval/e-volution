const router = require('express').Router();
const passport = require('passport');
const Note = require('../../models/Note');

const validateNoteCreation = require('../../validation/CreateNoteValidations');

/**
 * @route POST /api/notes
 * @desc Create new note
 * @access Private
 */

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateNoteCreation(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newNote = new Note({
      creator: req.user.id,
      executionDate: req.body.executionDate,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
    });

    newNote
      .save()
      .then((data) =>
        res.json({ msg: 'Nota creada con éxito', type: 'success', data })
      )
      .catch((err) =>
        res.status(400).json({
          msg: 'Error al crear la nota',
          type: 'danger',
          data: err,
        })
      );
  }
);

/**
 * @route GET /api/notes/
 * @desc Get all notes of one user
 * @access Private
 */
router.get(
  '/:status',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.find(
      {
        activeNote: true,
        creator: req.user.id,
        finishedTask: req.params.status,
      },
      { description: 0 }
    ).then((notes) => {
      if (notes.length < 1) {
        return res.status(400).json({
          msg:
            'Al parecer no tienes notas activas, crea tu primer nota dando click en "nueva"',
          type: 'info',
        });
      } else {
        res.json(notes);
      }
    });
  }
);

/**
 * @route PATCH /api/notes/:id
 * @desc Modify a specific to do
 * @access Private
 */

router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateNoteCreation(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Note.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          executionDate: req.body.executionDate,
          title: req.body.title,
          description: req.body.description,
          priority: req.body.priority,
        },
      },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        Note.find({ _id: req.body._id })
          .then((updatedNote) => {
            res.json({
              msg: 'Nota actualizada exitosamente',
              type: 'success',
              data: updatedNote[0],
            });
          })
          .catch((err) => {
            res.status(400).json({
              msg: 'Error al traer la nueva nota',
              type: 'error',
              data: err,
            });
          });
      })
      .catch((err) =>
        res.status(400).json({
          msg: 'Error al actualizar la nota',
          type: 'error',
          data: err,
        })
      );
  }
);

/**
 * @route PATCH /api/notes/finished/:id
 * @desc Set a note to finished
 * @access Private
 */

router.patch(
  '/finished/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.findOneAndUpdate(
      {
        _id: req.body.id,
        creator: req.user.id,
      },
      {
        $set: {
          finishedTask: !req.body.finishedTask,
          finishedDate: new Date().toISOString(),
        },
      },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        Note.find({ _id: req.body.id })
          .then((updatedNote) => {
            res.json({
              msg: 'Nota actualizada exitosamente',
              type: 'success',
              data: updatedNote[0],
            });
          })
          .catch((err) => {
            res.status(400).json({
              msg: 'Error al traer la nota actualizada',
              type: 'error',
              data: err,
            });
          });
      })
      .catch((err) =>
        res.status(400).json({
          msg: 'Error al terminar la nota',
          type: 'error',
          data: err,
        })
      );
  }
);

/**
 * @route DELETE /api/notes/:id
 * @desc Delete a specific note
 * @access Private
 */

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          activeNote: false,
        },
      },
      { new: true }
    )
      .then((data) =>
        res.json({ msg: 'Nota eliminada exitosamente', type: 'success', data })
      )
      .catch((err) =>
        res.status(400).json({
          msg: 'Error, no se pudo eliminar la nota',
          type: 'error',
          data: err,
        })
      );
  }
);

/**
 * @route GET /api/notes/:id
 * @desc Get one specific note // note details
 * @access Private
 */

router.get(
  '/byID/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.find({
      _id: req.params.id,
    }).then((notes) => {
      if (notes.length < 1) {
        return res.status(400).json({
          msg: 'no se encuentra la nota seleccionada',
          type: 'info',
        });
      } else {
        res.json(notes[0]);
      }
    });
  }
);

module.exports = router;
