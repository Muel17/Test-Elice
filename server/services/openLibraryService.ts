interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  subject?: string[];
  cover_i?: number;
  ratings_average?: number;
}

interface OpenLibrarySearchResponse {
  docs: OpenLibraryBook[];
  numFound: number;
}

export class OpenLibraryService {
  private baseUrl = process.env.OPENLIBRARY_API_URL || 'https://openlibrary.org';

  async searchBooks(query: string, limit: number = 20, offset: number = 0): Promise<OpenLibrarySearchResponse> {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString(),
        fields: 'key,title,author_name,first_publish_year,subject,cover_i,ratings_average'
      });

      const response = await fetch(`${this.baseUrl}/search.json?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`OpenLibrary API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching from OpenLibrary:', error);
      throw error;
    }
  }

  async getBookByKey(key: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${key}.json`);
      
      if (!response.ok) {
        throw new Error(`OpenLibrary API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching book details from OpenLibrary:', error);
      throw error;
    }
  }

  getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }

  mapToContent(book: OpenLibraryBook): any {
    return {
      title: book.title,
      description: book.subject?.slice(0, 3).join(', ') || 'A book from OpenLibrary',
      url: `https://openlibrary.org${book.key}`,
      imageUrl: book.cover_i ? this.getCoverUrl(book.cover_i) : null,
      source: 'openlibrary',
      externalId: book.key,
      contentType: 'book' as const,
      category: this.mapSubjectToCategory(book.subject?.[0]),
      rating: book.ratings_average ? parseFloat(book.ratings_average.toFixed(1)) : null,
      author: book.author_name?.[0] || 'Unknown Author',
    };
  }

  private mapSubjectToCategory(subject?: string): string {
    if (!subject) return 'programming';
    
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower.includes('programming') || subjectLower.includes('javascript') || subjectLower.includes('python')) {
      return 'programming';
    } else if (subjectLower.includes('design') || subjectLower.includes('ux') || subjectLower.includes('ui')) {
      return 'design';
    } else if (subjectLower.includes('business') || subjectLower.includes('management')) {
      return 'business';
    } else if (subjectLower.includes('science') || subjectLower.includes('data')) {
      return 'science';
    } else {
      return 'programming';
    }
  }
}

export const openLibraryService = new OpenLibraryService();
