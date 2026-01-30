import { Controller, Get, Post, Body } from '@nestjs/common';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('books')
  getBooks() {
    return this.libraryService.getAllBooks();
  }

  @Post('add')
  addBook(
    @Body()
    body: {
      title: string;
      author: string;
      isbn: string;
      serialNo: string;
    },
  ) {
    // TODO: Add Admin Guard
    return this.libraryService.addBook(body);
  }

  @Post('issue')
  async issueBook(@Body() body: { bookId: string; studentId: string }) {
    // TODO: Add Staff Guard
    return this.libraryService.issueBook(body.bookId, body.studentId);
  }

  @Post('return')
  async returnBook(@Body() body: { bookId: string; studentId: string }) {
    // TODO: Add Staff Guard
    return this.libraryService.returnBook(body.bookId, body.studentId);
  }
}
