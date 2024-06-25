import {Component, OnInit} from '@angular/core';
import {BookService} from "../../../../services/services/book.service";
import {Router} from "@angular/router";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {CommonModule} from "@angular/common";
import {BookCardComponent} from "../../components/book-card/book-card.component";
import {findAllBooks} from "../../../../services/fn/book/find-all-books";
import {BookResponse} from "../../../../services/models/book-response";
import {  ToastrService, ToastNoAnimation } from 'ngx-toastr';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    BookCardComponent
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit{
  public page: number = 0;
  public size: number = 4;
  bookResponse: PageResponseBookResponse = {};
  public message: string = "";

  constructor(
    private bookService: BookService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }
  findAllBooks(){
    this.bookService.findAllBooks({
      page: this.page,
      size: this.size
    }).subscribe({
      next: (books) => {
        this.bookResponse = books;
      }
    });
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBooks();

  }

  goToPreviousPage() {
    this.page--;
    this.findAllBooks();

  }

  goToPage(page: number) {
    this.page = page;
    this.findAllBooks();

  }

  goToNextPage() {
    this.page++;
    this.findAllBooks();

  }

  goToLastPage() {
    this.page = this.bookResponse.totalPages as number - 1;
    this.findAllBooks();

  }

  get isLastPage(): boolean {
    return this.page == this.bookResponse.totalPages as number - 1;
  }

  borrowBook(book: BookResponse) {
    this.message = '';
    this.bookService.borrowBook({
      'book-id' : book.id as number
    }).subscribe({
      next: () => {
        this.message = "Successfully added book to your list.";
        this.toastr.success(this.message, "Success");
        console.log(this.message);
      },
      error: err => {
        console.log(err);
        if (err.error.validationErrors) {
          this.toastr.error(err.error.validationErrors, "Fail");
        }
        else {
          this.toastr.error(err.error.error, "Fail");
        }
      }
    })
  }
}
