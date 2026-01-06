import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuthService } from '../services/AuthService';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  author: string;
  serialNo: string;
  status: string;
}

const LibraryDashboard: React.FC = () => {
  const { userIdentity } = useAuthService();
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', serialNo: '' });

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get('/api/library/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const addBook = async () => {
    try {
      await axios.post('/api/library/books', newBook);
      setNewBook({ title: '', author: '', serialNo: '' });
      fetchBooks();
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  if (!userIdentity.isConnected || userIdentity.role !== 'library') {
    return <div>Please login as library staff.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Library Dashboard</h1>

        <Card className="glassmorphism mb-8">
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              />
              <Input
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
              <Input
                placeholder="Serial No"
                value={newBook.serialNo}
                onChange={(e) => setNewBook({ ...newBook, serialNo: e.target.value })}
              />
            </div>
            <Button onClick={addBook} className="mt-4">Add Book</Button>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Book Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">by {book.author} - {book.serialNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{book.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LibraryDashboard;