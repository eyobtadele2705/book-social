import {Component, OnInit} from '@angular/core';
import {BookCardComponent} from "../../components/book-card/book-card.component";
import {NgForOf} from "@angular/common";
import {PageResponseBookResponse} from "../../../../services/models/page-response-book-response";
import {BookService} from "../../../../services/services/book.service";
import {Router, RouterLink} from "@angular/router";
import {BookResponse} from "../../../../services/models/book-response";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [
    BookCardComponent,
    NgForOf,
    RouterLink
  ],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss'
})
export class MyBooksComponent  implements OnInit{
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
    this.findBooksByOwner();
  }
  findBooksByOwner(){
    this.bookService.findBooksByOwner({
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
    this.findBooksByOwner();

  }

  goToPreviousPage() {
    this.page--;
    this.findBooksByOwner();

  }

  goToPage(page: number) {
    this.page = page;
    this.findBooksByOwner();

  }

  goToNextPage() {
    this.page++;
    this.findBooksByOwner();

  }

  goToLastPage() {
    this.page = this.bookResponse.totalPages as number - 1;
    this.findBooksByOwner();

  }

  get isLastPage(): boolean {
    return this.page == this.bookResponse.totalPages as number - 1;
  }


  archiveBook(book: BookResponse) {
    this.bookService.updateBookArchivedStatus({
      "book-id": book.id as number
    }).subscribe({
      next: () => {
        book.archived = !book.archived;
        this.toastr.success("Book archived status updated successfully", "Success");
      }
    })

  }

  shareBook(book: BookResponse) {
    this.bookService.updateBookShareable({
      "book-id": book.id as number
    }).subscribe({
      next: () => {
        book.shareable = !book.shareable;
        this.toastr.success("Book shareable status updated successfully", "Success");
      }
    });

  }

  editBook(book: BookResponse) {
    this.router.navigate(['books', 'manage', book.id]);
  }
}
