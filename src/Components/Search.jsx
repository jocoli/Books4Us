import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
    //
    const [query, setQuery] = useState(''); // store search query
    const [books, setBooks] = useState([]); // store fetched books
    const [startIndex, setStartIndex] = useState(0); // track start index (pages)
    const maxResults = 10;
    const [savedBooks, setSavedBooks] = useState([]); // store saved books
    const [saveMessages, setSaveMessages] = useState({}); // track which books show the save message

    const handleSearch = async (e) => { 
        if (e) {
            e.preventDefault();
        }

        if (query.trim() === '') return;

        try {
            const response = await fetch(`/api/books?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}`);
            const data = await response.json();
            setBooks(data.items || []);
        } 
        catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [query, startIndex]);

    useEffect(() => {
        const fetchSavedBooks = async () => {
            try {
                const response = await fetch('/api/saved-books');
                const data = await response.json();
                setSavedBooks(data);
            } 
            catch (error) {
                console.error('Error fetching saved books:', error);
            }
        };

        fetchSavedBooks();
    }, []);

    const handleNextPage = () => {
        setStartIndex((startIndex) => startIndex + maxResults);
    };

    const handlePrevPage = () => {
        setStartIndex((startIndex) => startIndex - maxResults);
    };

    const handleSaveBook = async (book) => {
        try {
            // Check if the book already exists in the saved books
            const bookExists = savedBooks.some(savedBook => savedBook.id === book.id);

            if (bookExists) {
                // Set state to indicate that the book is already saved and show the message
                setSaveMessages(prevState => ({ ...prevState, [book.id]: 'Book already saved.' }));
            } 
            else {
                // Save the book to the database
                const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
                });

                if (response.ok) {
                    console.log('Book saved successfully');
                    setSavedBooks(prevState => [...prevState, book]);
                    setSaveMessages(prevState => ({ ...prevState, [book.id]: null })); // Clear any existing message
                }
                else {
                    console.error('Failed to save book:', response.statusText);
                }
            }
        } 
        catch (error) {
            console.error("Error saving book:", error);
        }
    };

    const handleSavedClick = (bookId) => {
        // Show the "Book already saved." message when clicking on "Saved"
        setSaveMessages(prevState => ({ ...prevState, [bookId]: 'Book already saved.' }));
    };

    return (
        <div className="Search">
        <h1>Books4Us</h1>
        <p>Search for a book below.</p>
        <form onSubmit={(e) => handleSearch(e)}>
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books"
            />
            <button type="submit">Search</button>
        </form>
        <div className="BookResults">
            {books.map((book) => {
            
            const isSaved = savedBooks.some(savedBook => savedBook.id === book.id);

            return (
                <div key={book.id} className="BookItem">
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
                <div className="SaveBook">
                    {isSaved ? (
                    <>
                        <button onClick={() => handleSavedClick(book.id)}>Saved</button>
                        {saveMessages[book.id] && <p>{saveMessages[book.id]}</p>}
                    </>
                    ) : (
                    <button onClick={() => handleSaveBook(book)}>Save Book</button>
                    )}
                </div>
                </div>
            );
            })}
        </div>
        <div className="page-index">
            <button onClick={handlePrevPage} disabled={startIndex === 0}>
            Previous Page
            </button>
            <button onClick={handleNextPage}>Next Page</button>
        </div>
        </div>
    );
    };

export default Search;