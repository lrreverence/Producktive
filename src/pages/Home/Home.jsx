import React, { useState, useEffect } from 'react';
import Navbar from '../../components/NavBar/Navbar';
import { getAllNotes, addNote, editNote, deleteNote, updateNotePinned } from '../../api';
import { useLocation } from 'react-router-dom';

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  return (
    <div
      className="break-inside-avoid mb-4 bg-white dark:bg-[#28292c] text-gray-900 dark:text-gray-100 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer border border-gray-100 dark:border-gray-700 p-4 min-h-[120px]"
      onClick={() => onEdit(note)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 break-words pr-2">{note.title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={e => { e.stopPropagation(); onTogglePin(note); }}
            className={note.isPinned ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            {note.isPinned ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.75 2a.75.75 0 01.75.75V4a4 4 0 013.25 3.92v2.34l1.6 1.6a.75.75 0 01-.53 1.28H13v2.25a.75.75 0 01-1.5 0V13H8.5v2.25a.75.75 0 01-1.5 0V13H5.18a.75.75 0 01-.53-1.28l1.6-1.6V7.92A4 4 0 019.5 4V2.75A.75.75 0 018.75 2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.75 2a.75.75 0 01.75.75V4a4 4 0 013.25 3.92v2.34l1.6 1.6a.75.75 0 01-.53 1.28H13v2.25a.75.75 0 01-1.5 0V13H8.5v2.25a.75.75 0 01-1.5 0V13H5.18a.75.75 0 01-.53-1.28l1.6-1.6V7.92A4 4 0 019.5 4V2.75A.75.75 0 018.75 2z" />
              </svg>
            )}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEdit(note); }}
            className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(note._id); }}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 break-words">{note.content}</p>
      <div className="flex flex-wrap gap-1">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const AddEditNotePopup = ({ note, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    tags: note?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {note ? 'Edit Note' : 'Add New Note'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag); }}
                      className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleAddTag(e); }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {note ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const location = useLocation();
  const searchResults = location.state?.searchResults || null;
  const searchQuery = location.state?.searchQuery || '';

  useEffect(() => {
    if (!searchResults) {
      const fetchNotes = async () => {
        try {
          const response = await getAllNotes();
          setNotes(response.notes);
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      };
      fetchNotes();
    } else {
      setNotes(searchResults);
    }
    // eslint-disable-next-line
  }, [searchResults]);

  const handleAddNote = () => {
    setEditingNote(null);
    setIsPopupOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsPopupOpen(true);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      const response = await getAllNotes();
      setNotes(response.notes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await editNote(editingNote._id, noteData);
      } else {
        await addNote(noteData);
      }
      const response = await getAllNotes();
      setNotes(response.notes);
    } catch (error) {
      console.error('Error saving note:', error);
    }
    setIsPopupOpen(false);
  };

  const handleTogglePin = async (note) => {
    try {
      await updateNotePinned(note._id, !note.isPinned);
      const response = await getAllNotes();
      setNotes(response.notes);
    } catch (error) {
      console.error('Error pinning/unpinning note:', error);
    }
  };

  // Split notes into pinned and others
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const otherNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="min-h-screen bg-[#f6f8fc] dark:bg-[#202124]">
      <Navbar />
      <main className="max-w-6xl mx-auto py-8 px-2 sm:px-6 lg:px-8">
        <div className="relative">
          <button
            onClick={handleAddNote}
            className="fixed z-20 bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:focus:ring-yellow-600"
            title="Add Note"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {searchResults ? `Search Results for "${searchQuery}"` : 'My Notes'}
          </h1>
          {pinnedNotes.length > 0 && (
            <>
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 pl-1 tracking-widest uppercase">Pinned</h2>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mb-8">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </>
          )}
          {otherNotes.length > 0 && (
            <>
              {pinnedNotes.length > 0 && <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 pl-1 tracking-widest uppercase">Others</h2>}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </>
          )}
          {notes.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400 dark:text-gray-500">No notes available. Add a new note to get started!</p>
            </div>
          )}
        </div>
      </main>
      {isPopupOpen && (
        <AddEditNotePopup
          note={editingNote}
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
};

export default Home;
