import { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Button } from "../../components/ui/button";
import { Book, Search, Clock, ShieldCheck, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: string;
  title: string;
  author: string;
  status: "AVAILABLE" | "ISSUED";
  serial: string;
  category: string;
  isbn: string;
  dueDate?: string;
  issuedTo?: string;
}

// Mock Data (Replace with API)
const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    status: "AVAILABLE",
    serial: "LIB-CS-001",
    category: "Computer Science",
    isbn: "978-0262033848",
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    status: "ISSUED",
    dueDate: "2024-02-15",
    serial: "LIB-CS-002",
    issuedTo: "John Doe",
    category: "Software Engineering",
    isbn: "978-0132350884",
  },
  {
    id: "3",
    title: "Design Patterns",
    author: "Erich Gamma",
    status: "AVAILABLE",
    serial: "LIB-CS-003",
    category: "Software Engineering",
    isbn: "978-0201633610",
  },
];

export const LibraryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [activeTab, setActiveTab] = useState<"search" | "my-books" | "manage">("search");
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [studentId, setStudentId] = useState("");

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serial.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleIssueBook = async (bookId: string) => {
    if (!studentId.trim()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBooks(books.map(book =>
        book.id === bookId
          ? { ...book, status: "ISSUED", issuedTo: studentId, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
          : book
      ));
      setLoading(false);
      setShowIssueModal(false);
      setStudentId("");
    }, 1000);
  };

  const handleReturnBook = async (bookId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBooks(books.map(book =>
        book.id === bookId
          ? { ...book, status: "AVAILABLE", issuedTo: undefined, dueDate: undefined }
          : book
      ));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Book className="w-8 h-8 text-cyan-400" />
            Central Library Management
          </h1>
          <p className="text-slate-400 mt-1">
            Manage catalogue, issue books & track returns.
          </p>
        </div>
        <div className="flex bg-slate-800/50 p-1 rounded-lg backdrop-blur-md border border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-3 md:px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${activeTab === "search" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
          >
            Catalogue
          </button>
          <button
            onClick={() => setActiveTab("my-books")}
            className={`px-3 md:px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${activeTab === "my-books" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
          >
            Issued Books
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-3 md:px-4 py-2 rounded-md text-sm transition-all whitespace-nowrap ${activeTab === "manage" ? "bg-cyan-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
          >
            Manage Books
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "search" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
            key="search"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Title, Author, Serial No..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredBooks.map((book) => (
                <GlassCard
                  key={book.id}
                  className="group hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-16 bg-slate-700 rounded shadow-inner flex items-center justify-center">
                      <Book className="text-slate-500 w-6 h-6" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-mono font-bold ${book.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                    >
                      {book.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white truncate">
                    {book.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">{book.author}</p>
                  <p className="text-slate-500 text-xs mb-4">{book.category}</p>

                  <div className="flex justify-between items-center border-t border-slate-700/50 pt-4">
                    <span className="text-xs text-slate-500 font-mono">
                      {book.serial}
                    </span>
                    {book.status === "AVAILABLE" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-cyan-400 hover:bg-cyan-400/10"
                        onClick={() => {
                          setSelectedBook(book);
                          setShowIssueModal(true);
                        }}
                      >
                        Issue
                      </Button>
                    ) : (
                      <div className="text-right">
                        <div className="text-xs text-amber-400">Due: {book.dueDate}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-400/10"
                          onClick={() => handleReturnBook(book.id)}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Return"}
                        </Button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        ) : activeTab === "my-books" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="my-books"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {books.filter(b => b.status === "ISSUED").map((book) => (
              <GlassCard key={book.id} className="border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{book.title}</h3>
                    <p className="text-slate-400">{book.author}</p>
                    <p className="text-slate-500 text-sm">Issued to: {book.issuedTo}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-amber-400 font-bold flex items-center gap-1 justify-end">
                      <Clock className="w-4 h-4" /> Due Soon
                    </div>
                    <div className="text-xs text-slate-500">{book.dueDate}</div>
                  </div>
                </div>

                <div className="mt-6 bg-slate-950/50 p-4 rounded-lg flex items-center gap-4 border border-slate-800">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  <div>
                    <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider mb-1">
                      Blockchain Verified
                    </div>
                    <div className="text-xs text-slate-500 font-mono break-all">
                      0x71c...a923 (Issue Tx)
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key="manage"
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Book Management</h2>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Book
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {books.map((book) => (
                <GlassCard key={book.id}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-16 bg-slate-700 rounded shadow-inner flex items-center justify-center">
                      <Book className="text-slate-500 w-6 h-6" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-mono font-bold ${book.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                    >
                      {book.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white truncate">
                    {book.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">{book.author}</p>
                  <p className="text-slate-500 text-xs mb-4">ISBN: {book.isbn}</p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      Remove
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Issue Modal */}
      {showIssueModal && selectedBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Issue Book</h3>
            <p className="text-slate-400 mb-4">
              Issuing: <span className="text-white">{selectedBook.title}</span>
            </p>
            <input
              type="text"
              placeholder="Student ID / Roll Number"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none mb-4"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                onClick={() => handleIssueBook(selectedBook.id)}
                disabled={loading || !studentId.trim()}
                className="flex-1"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Issue Book
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowIssueModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
