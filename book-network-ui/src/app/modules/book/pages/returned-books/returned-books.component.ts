import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PageResponseBorrowedBookResponse} from "../../../../services/models/page-response-borrowed-book-response";
import {BorrowedBookResponse} from "../../../../services/models/borrowed-book-response";
import {FeedbackRequest} from "../../../../services/models/feedback-request";
import {BookService} from "../../../../services/services/book.service";
import {FeedbackService} from "../../../../services/services/feedback.service";
import {ToastrService} from "ngx-toastr";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {findAllReturnedBooks} from "../../../../services/fn/book/find-all-returned-books";

@Component({
  selector: 'app-returned-books',
  standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './returned-books.component.html',
  styleUrl: './returned-books.component.scss'
})
export class ReturnedBooksComponent implements OnInit{
  returnedBooks: PageResponseBorrowedBookResponse = {};
  public page: number = 0;
  public size: number = 5;
  public selectedBook: BorrowedBookResponse | undefined = undefined;

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res) =>{
        this.returnedBooks = res;
      }
    })
  }


  goToFirstPage() {
    this.page = 0;
    this.findAllReturnedBooks();

  }

  goToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();

  }

  goToPage(page: number) {
    this.page = page;
    this.findAllReturnedBooks();

  }

  goToNextPage() {
    this.page++;
    this.findAllReturnedBooks();

  }

  goToLastPage() {
    this.page = this.returnedBooks.totalPages as number - 1;
    this.findAllReturnedBooks();

  }

  get isLastPage(): boolean {
    return this.page == this.returnedBooks.totalPages as number - 1;
  }


  approveReturnedBook(book: BorrowedBookResponse) {
    if (!book.returned) {
      this.toastr.error("The Book is not returned yet", "Fail");
      return;
    }
      this.bookService.approveReturnedBook({
        'book-id': book.id as number
      }).subscribe({
        next: () => {
          this.toastr.success("Book return approved successfully", "Success");
          this.findAllReturnedBooks();
        },
        error: (err) => {
          this.toastr.error(err.error.error, "Fail");
          this.findAllReturnedBooks();
        }
      })
  }
}
