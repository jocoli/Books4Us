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
            {book.smallThumbnail && (
              <img
                src={book.smallThumbnail}
                alt={book.title}
                className="BookThumbnail"
              />
            )}
            <div className="BookInfo">
              <h2>{book.title}</h2>
              <p>{book.authors?.join(', ')}</p>
              <p>{book.publishedDate}</p>
              <Link to={`/book/${book.bookID}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedBooks;