import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {BorrowedBookResponse} from "../../../../services/models/borrowed-book-response";
import {PageResponseBorrowedBookResponse} from "../../../../services/models/page-response-borrowed-book-response";
import {BookService} from "../../../../services/services/book.service";
import {FeedbackRequest} from "../../../../services/models/feedback-request";
import {FormsModule} from "@angular/forms";
import {RatingComponent} from "../../components/rating/rating.component";
import {RouterLink} from "@angular/router";
import {FeedbackService} from "../../../../services/services/feedback.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-borrowed-book-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    RatingComponent,
    RouterLink
  ],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit{
  myBorrowedBooks: PageResponseBorrowedBookResponse = {};
  public page: number = 0;
  public size: number = 5;
  public selectedBook: BorrowedBookResponse | undefined = undefined;
  public feedbackRequest: FeedbackRequest = {bookId: 0, comment: "", note: 0};

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService,
    private toastr: ToastrService
  ) {
  }
  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = this.selectedBook.id as number;
  }

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res) =>{
        this.myBorrowedBooks = res;
      }
    })
  }


  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();

  }

  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();

  }

  goToPage(page: number) {
    this.page = page;
    this.findAllBorrowedBooks();

  }

  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();

  }

  goToLastPage() {
    this.page = this.myBorrowedBooks.totalPages as number - 1;
    this.findAllBorrowedBooks();

  }

  get isLastPage(): boolean {
    return this.page == this.myBorrowedBooks.totalPages as number - 1;
  }


  returnBook(withFeedback: boolean) {
    this.bookService.returnBook({
      'book-id': this.selectedBook?.id as number
    }).subscribe({
      next: () => {
        if (withFeedback){
          this.giveFeedback();
          this.toastr.success("Book returned successfully", "Success");
        }
        this.selectedBook = undefined;
        this.findAllBorrowedBooks();
      },
      error: (err) => {
        this.toastr.error(err.error.validationErrors);
      }
    })
  }

  private giveFeedback() {
    this.feedbackService.saveFeedback({
      body: this.feedbackRequest
    }).subscribe({
      next: () => {
      }
    })
  }
}
