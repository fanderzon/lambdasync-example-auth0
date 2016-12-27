const uuid = require('node-uuid').v4;

const CONSTANTS = require('./constants');
const SUCCESS = {
  result: 'success'
};

function getNote(db, id) {
  const filter = {id};
  return new Promise((resolve, reject) => {
    db.collection(CONSTANTS.COLLECTION_NOTES).findOne(filter, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function getNotes(db, userId) {
  const filter = {userId};
  return new Promise((resolve, reject) => {
    db.collection(CONSTANTS.COLLECTION_NOTES).find(filter).toArray((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function deleteNote(db, userId, id) {
  if (!id) {
    return Promise.reject('Missing id');
  }
  return new Promise((resolve, reject) => {
    db
      .collection(CONSTANTS.COLLECTION_NOTES)
      .deleteOne({id}, err => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.stringify(SUCCESS));
      });
  });
}

function updateNote(db, userId, noteId, note) {
  if (!note || !noteId) {
    return Promise.reject();
  }

  return getNote(db, noteId)
    .then(currentNote => new Promise((resolve, reject) => {
      db
        .collection(CONSTANTS.COLLECTION_NOTES)
        .updateOne({id: noteId}, Object.assign({}, currentNote, note), err => {
          if (err) {
            return reject(err);
          }
          return resolve(SUCCESS);
        });
    }));
}

function addNote(db, userId, note) {
  if (!userId || !note) {
    return Promise.reject('No userId or note to add.');
  }
  return new Promise((resolve, reject) => {
    db
      .collection(CONSTANTS.COLLECTION_NOTES)
      .insertOne(
        Object.assign({}, note, {
          id: uuid(),
          userId,
          pinned: false
        }),
        err => {
          if (err) {
            reject(err);
          }
          resolve(JSON.stringify(SUCCESS));
        }
      );
  });
}

module.exports = {
  getNotes,
  deleteNote,
  updateNote,
  addNote
};
