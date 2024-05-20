import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetails.css'; // Import the CSS file

const BookDetails = () => {
const { id } = useParams(); // Get the book ID from URL parameters
  const [bookDetails, setBookDetails] = useState(null); // State to store book details
  const [savedBooks, setSavedBooks] = useState([]); // State to store saved books
  const [saveMessage, setSaveMessage] = useState(null); // State to store save message

  useEffect(() => {
    // Fetch book details when component mounts
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/book/${id}`); // Replace with your API endpoint
        const data = await response.json();
        setBookDetails(data); // Update book details state with fetched data
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();

    // Fetch saved books when component mounts
    const fetchSavedBooks = async () => {
      try {
        const response = await fetch('/api/saved-books');
        const data = await response.json();
        setSavedBooks(data);
      } catch (error) {
        console.error('Error fetching saved books:', error);
      }
    };

    fetchSavedBooks();

    // Cleanup function to clear book details when component unmounts
    return () => {
      setBookDetails(null);
      setSaveMessage(null);
    };
  }, [id]);

  // If book details are still being fetched, display a loading message
  if (!bookDetails) {
    return <div>Loading...</div>;
  }

  const { volumeInfo } = bookDetails;
  const decodedDescription = volumeInfo.description ? volumeInfo.description.replace(/�/g, "'") : null;

  const isBookSaved = savedBooks.some(savedBook => savedBook.id === bookDetails.id);

  const handleSaveBook = async () => {
    try {
      // Check if the book already exists in the saved books
      if (isBookSaved) {
        setSaveMessage('Book already saved.');
      } else {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookDetails),
        });

        if (response.ok) {
          console.log('Book saved successfully');
          setSavedBooks(prevState => [...prevState, bookDetails]);
          setSaveMessage(null); // Clear any existing message
        } else {
          console.error('Failed to save book:', response.statusText);
        }
      }
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  return (
    <div className="BookDetails">
      <div className="Thumbnail">
        <img src={volumeInfo.imageLinks?.thumbnail} alt={volumeInfo.title} />
      </div>
      <div className="Info">
        <h2>{volumeInfo.title}</h2>
        <p>Author(s): {volumeInfo.authors?.join(', ') || 'N/A'}</p>
        <p>Description: {decodedDescription ? <div dangerouslySetInnerHTML={{ __html: decodedDescription }} /> : 'N/A'}</p>
        <p>Page Count: {volumeInfo.pageCount || 'N/A'}</p>
        <p>Ratings: {volumeInfo.averageRating ? `${volumeInfo.averageRating}/5` : 'N/A'}</p>
        <p>Number of Ratings: {volumeInfo.ratingsCount || 'N/A'}</p>
        <p>Preview: {volumeInfo.previewLink ? <a href={volumeInfo.previewLink}>Preview Link</a> : 'N/A'}</p>
        <p>Buy: {volumeInfo.buyLink ? <a href={volumeInfo.buyLink}>Buy Link</a> : 'N/A'}</p>
        <p>Download ePub: {volumeInfo.epubLink ? <a href={volumeInfo.epubLink}>ePub Link</a> : 'N/A'}</p>
        <p>Download PDF: {volumeInfo.pdfLink ? <a href={volumeInfo.pdfLink}>PDF Link</a> : 'N/A'}</p>
        <p>Read on Web: {volumeInfo.webReaderLink ? <a href={volumeInfo.webReaderLink}>Web Reader Link</a> : 'N/A'}</p>
      </div>
      <div className="SaveBook">
        {isBookSaved ? (
          <>
            <button onClick={() => setSaveMessage('Book already saved.')}>Saved</button>
            {saveMessage && <p>{saveMessage}</p>}
          </>
        ) : (
          <button onClick={handleSaveBook}>Save Book</button>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
