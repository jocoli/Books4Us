// BookLists.jsx

import React, { useState, useEffect } from 'react';
import './SavedBooks.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';

const SavedBooks = () => {
  const [savedBooks, setSavedBooks] = useState([]);

  useEffect(() => {
    // Fetch saved books from your server
    const fetchSavedBooks = async () => {
      try {
        const response = await fetch('/api/saved-books');
        const data = await response.json();
        console.log('Fetched saved books:', data); // Add this line for logging
        setSavedBooks(data);
      } catch(error) {
        console.error('Error fetching saved books:', error);
      }
    };
    fetchSavedBooks();
  }, []);

  

  return (
    <div className="Saved-Books">
      <h2>Saved Books</h2>
      <div className="BookResults">
        {savedBooks.map((book) => (
          <div key={book._id} className="BookItem">
            {book.volumeInfo.imageLinks?.smallThumbnail && (
              <img
                src={book.volumeInfo.imageLinks.smallThumbnail}
                alt={book.volumeInfo.title}
                className="BookThumbnail"
              />
            )}
            <div className="BookInfo">
              <h2>{book.volumeInfo.title}</h2>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
              <p>{book.volumeInfo.publishedDate}</p>
              <Link to={`/book/${book.id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedBooks;