import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

export const searchBooks = async (query, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        q: query,
        page: page,
        limit: limit,
      }
    });

    return response.data.docs.map(book => ({
      key: book.key,
      title: book.title,
      author_name: book.author_name || ['Unknown Author'],
      first_publish_year: book.first_publish_year,
      cover_i: book.cover_i,
      isbn: book.isbn?.[0],
      ratings_average: book.ratings_average,
      ratings_count: book.ratings_count,
      subject: book.subject || [],
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books. Please try again.');
  }
};

export const getBookDetails = async (bookId) => {
  try {
    // Remove the leading '/works/' if present
    const workId = bookId.replace('/works/', '');
    
    const response = await axios.get(`${BASE_URL}/works/${workId}.json`);
    const bookData = response.data;

    // Get author details
    let author = { name: 'Unknown Author' };
    if (bookData.authors && bookData.authors.length > 0) {
      const authorId = bookData.authors[0].author.key.replace('/authors/', '');
      const authorResponse = await axios.get(`${BASE_URL}/authors/${authorId}.json`);
      author = {
        name: authorResponse.data.name,
        bio: authorResponse.data.bio || 'No biography available',
      };
    }

    // Get cover image
    const coverId = bookData.covers?.[0];
    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : null;

    return {
      key: bookData.key,
      title: bookData.title,
      description: bookData.description 
        ? (typeof bookData.description === 'string' 
            ? bookData.description 
            : bookData.description.value || 'No description available')
        : 'No description available',
      author,
      first_publish_date: bookData.first_publish_date,
      covers: bookData.covers || [],
      cover_url: coverUrl,
      subjects: bookData.subjects || [],
      subject_people: bookData.subject_people || [],
      subject_places: bookData.subject_places || [],
      subject_times: bookData.subject_times || [],
      links: bookData.links || [],
      excerpts: bookData.excerpts || [],
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to fetch book details. Please try again.');
  }
};

export const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books`, {
      params: {
        bibkeys: `ISBN:${isbn}`,
        format: 'json',
        jscmd: 'data'
      }
    });

    const bookData = response.data[`ISBN:${isbn}`];
    if (!bookData) {
      throw new Error('Book not found');
    }

    return {
      title: bookData.title,
      authors: bookData.authors?.map(author => author.name) || ['Unknown Author'],
      publish_date: bookData.publish_date,
      publishers: bookData.publishers || [],
      number_of_pages: bookData.number_of_pages,
      cover_url: bookData.cover?.large || bookData.cover?.medium,
      subjects: bookData.subjects || [],
      identifiers: bookData.identifiers || {},
      url: bookData.url,
    };
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw new Error('Failed to fetch book. Please try again.');
  }
};

export const getBooksBySubject = async (subject, limit = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/subjects/${subject}.json`, {
      params: {
        limit: limit
      }
    });

    return response.data.works.map(work => ({
      key: work.key,
      title: work.title,
      author_name: work.authors?.map(a => a.name) || ['Unknown Author'],
      cover_i: work.cover_id,
      first_publish_year: work.first_publish_year,
      ratings_average: work.ratings_average,
      ratings_count: work.ratings_count,
    }));
  } catch (error) {
    console.error('Error fetching books by subject:', error);
    throw new Error('Failed to fetch books. Please try again.');
  }
};
