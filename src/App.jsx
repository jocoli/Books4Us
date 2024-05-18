import React, { useState, useEffect } from 'react';
import NavBar from './Components/NavBar';


function App() {
  const [query, setQuery] = useState(''); // store search query
  const [books, setBooks] = useState([]); // store fetched books
  const [startIndex, setStartIndex] = useState(0); // track start index (pages)
  const maxResults = 10;

  const handleSearch = async (e) => {
    // if e is defined
    if(e) {
      e.preventDefault();
    }
    
    if (query.trim() === '') return;

    try {
      const response = await fetch(`/api/books?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
  };

  // Fetch books when component mounts or when query or startIndex changes
  useEffect(() => {
    handleSearch();
  }, [query, startIndex]);

  const handleNextPage = () => {
    setStartIndex(startIndex => startIndex + maxResults);
  };

  const handlePrevPage = () => {
    setStartIndex(startIndex => startIndex - maxResults);
  }

  return (
    <div className='App'>
      <div className='Nav'>
        <NavBar />
      </div>
      <div className='Search'>
        <h1>Books4Us</h1>
        <p>Search for a book below.</p>
        <form onSubmit={(e) =>handleSearch(e)}>
          <input 
            type='text' 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for books'
          />
          <button type='submit'>Search</button>
        </form>
        <div className='BookResults'>
          {books.map(book => (
            <div key={book.id} className='BookItem'>
              {book.volumeInfo.imageLinks?.smallThumbnail && (
                <img 
                  src={book.volumeInfo.imageLinks.smallThumbnail} 
                  alt={book.volumeInfo.title} 
                  className='BookThumbnail'
                />
              )}
              <div className='BookInfo'>
                <h2>{book.volumeInfo.title}</h2>
                <p>{book.volumeInfo.authors?.join(', ')}</p>
                <p>{book.volumeInfo.publishedDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='page-index'>
        <button onClick={handlePrevPage} disabled={startIndex === 0}>Previous Page</button>
        <button onClick={handleNextPage}>Next Page</button>
      </div>
    </div>
  );
}

export default App;