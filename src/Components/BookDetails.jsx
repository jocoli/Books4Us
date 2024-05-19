import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from URL parameters
  const [bookDetails, setBookDetails] = useState(null); // State to store book details

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

    // Cleanup function to clear book details when component unmounts
    return () => setBookDetails(null);
  }, [id]);

  // If book details are still being fetched, display a loading message
  if (!bookDetails) {
    return <div>Loading...</div>;
  }

  const { volumeInfo } = bookDetails;
  const decodedDescription = volumeInfo.description ? volumeInfo.description.replace(/�/g, "'") : null;


  return (
    <div className="BookDetails">
      <img src={volumeInfo.imageLinks?.thumbnail} alt={volumeInfo.title} />
      <h2>{volumeInfo.title}</h2>
      <p>Author(s): {volumeInfo.authors?.join(', ') || 'N/A'}</p>
      <p>Description: {decodedDescription ? <div dangerouslySetInnerHTML={{ __html: decodedDescription }} /> : 'N/A'}</p>
      <p>Page Count: {volumeInfo.pageCount || 'N/A'}</p>
      <p>Ratings: {volumeInfo.averageRating ? `${volumeInfo.averageRating}/5 (${volumeInfo.ratingsCount} ratings)` : 'N/A'}</p>
      <p>Number of Ratings: {volumeInfo.ratingsCount || 'N/A'}</p>
      <p>
        Preview: {volumeInfo.previewLink ? <a href={volumeInfo.previewLink}>Preview Link</a> : 'N/A'}
      </p>
      <p>
        Buy: {volumeInfo.buyLink ? <a href={volumeInfo.buyLink}>Buy Link</a> : 'N/A'}
      </p>
      <p>
        Download ePub: {volumeInfo.epubLink ? <a href={volumeInfo.epubLink}>ePub Link</a> : 'N/A'}
      </p>
      <p>
        Download PDF: {volumeInfo.pdfLink ? <a href={volumeInfo.pdfLink}>PDF Link</a> : 'N/A'}
      </p>
      <p>
        Read on Web: {volumeInfo.webReaderLink ? <a href={volumeInfo.webReaderLink}>Web Reader Link</a> : 'N/A'}
      </p>
    </div>
  );
};

export default BookDetails;