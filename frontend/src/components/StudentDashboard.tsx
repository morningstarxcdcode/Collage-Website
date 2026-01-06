import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useAuthService } from '../services/AuthService';
import { FeePayment } from '../features/student/FeePayment';
import { ExamForm } from '../features/student/ExamForm';
import { LibraryBorrowing } from '../features/student/LibraryBorrowing';
import axios from 'axios';

interface Transaction {
  id: string;
  type: 'payment' | 'exam' | 'library';
  amount?: number;
  description: string;
  date: string;
  txHash?: string;
}

const StudentDashboard: React.FC = () => {
  const { userIdentity } = useAuthService();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'fees' | 'exams' | 'library'>('dashboard');

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`/api/student/transactions/${userIdentity.studentId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [userIdentity.studentId]);

  useEffect(() => {
    if (userIdentity.studentId) {
      fetchTransactions();
    }
  }, [userIdentity.studentId, fetchTransactions]);

  if (!userIdentity.isConnected || userIdentity.role !== 'student') {
    return <div>Please login as a student.</div>;
  }

  // Render different pages based on currentPage
  if (currentPage === 'fees') {
    return (
      <div>
        <Button
          onClick={() => setCurrentPage('dashboard')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <FeePayment />
      </div>
    );
  }

  if (currentPage === 'exams') {
    return (
      <div>
        <Button
          onClick={() => setCurrentPage('dashboard')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <ExamForm />
      </div>
    );
  }

  if (currentPage === 'library') {
    return (
      <div>
        <Button
          onClick={() => setCurrentPage('dashboard')}
          variant="outline"
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <LibraryBorrowing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Student Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Fee Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentPage('fees')}>Pay Fees</Button>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Exam Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentPage('exams')}>Submit Exam Form</Button>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentPage('library')}>Borrow Books</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      {tx.amount && <p className="font-bold">₹{tx.amount}</p>}
                      {tx.txHash && (
                        <Badge variant="secondary" className="text-xs">
                          Verified on Blockchain
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;