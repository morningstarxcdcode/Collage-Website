import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, BookOpen, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthService } from '../../services/AuthService';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  serialNo: string;
  status: 'AVAILABLE' | 'ISSUED' | 'LOST';
  issuedTo?: string;
  dueDate?: string;
}

export const LibraryBorrowing: React.FC = () => {
  const { userIdentity } = useAuthService();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [borrowingBook, setBorrowingBook] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.serialNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [books, searchTerm]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/library/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const handleBorrowBook = async (bookId: string) => {
    if (!userIdentity.studentId) return;

    setBorrowingBook(bookId);
    setLoading(true);

    try {
      await axios.post('/api/library/issue', {
        bookId,
        studentId: userIdentity.studentId,
      });

      // Refresh books list
      await fetchBooks();
      alert('Book borrowed successfully!');
    } catch (error: unknown) {
      console.error('Failed to borrow book:', error);
      alert('Failed to borrow book');
    } finally {
      setLoading(false);
      setBorrowingBook(null);
    }
  };

  const getStatusBadge = (book: Book) => {
    switch (book.status) {
      case 'AVAILABLE':
        return <Badge className="bg-green-500/20 text-green-400">Available</Badge>;
      case 'ISSUED':
        return <Badge className="bg-red-500/20 text-red-400">Issued</Badge>;
      case 'LOST':
        return <Badge className="bg-gray-500/20 text-gray-400">Lost</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const isBookIssuedToCurrentUser = (book: Book) => {
    return book.issuedTo === userIdentity.studentId;
  };

  if (!userIdentity.isConnected || userIdentity.role !== 'student') {
    return <div>Please login as a student to access library services.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Library Books</h2>
      </div>

      {/* Search Bar */}
      <GlassCard className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search books by title, author, or serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </GlassCard>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <GlassCard key={book.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{book.title}</h3>
                <p className="text-slate-400 mb-1">by {book.author}</p>
                <p className="text-sm text-slate-500">ISBN: {book.isbn}</p>
                <p className="text-sm text-slate-500">Serial: {book.serialNo}</p>
              </div>
              {getStatusBadge(book)}
            </div>

            {book.status === 'ISSUED' && book.issuedTo === userIdentity.studentId && book.dueDate && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-center text-blue-400 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Due Date</span>
                </div>
                <p className="text-blue-300 text-sm">
                  {new Date(book.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              {book.status === 'AVAILABLE' && (
                <Button
                  onClick={() => handleBorrowBook(book.id)}
                  disabled={loading && borrowingBook === book.id}
                  className="w-full"
                >
                  {loading && borrowingBook === book.id ? (
                    'Borrowing...'
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Borrow Book
                    </>
                  )}
                </Button>
              )}

              {isBookIssuedToCurrentUser(book) && (
                <div className="w-full text-center">
                  <div className="flex items-center justify-center text-green-400 mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Currently Borrowed</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Return Book
                  </Button>
                </div>
              )}

              {book.status === 'ISSUED' && !isBookIssuedToCurrentUser(book) && (
                <div className="w-full text-center text-slate-400">
                  <AlertCircle className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-sm">Currently issued to another student</p>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <GlassCard className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
          <p className="text-slate-400">
            {searchTerm ? 'Try adjusting your search terms' : 'No books available in the library'}
          </p>
        </GlassCard>
      )}
    </div>
  );
};