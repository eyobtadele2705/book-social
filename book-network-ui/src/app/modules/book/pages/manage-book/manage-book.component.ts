import {Component, NgModule, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {BookRequest} from "../../../../services/models/book-request";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {saveBook} from "../../../../services/fn/book/save-book";

import {BookService} from "../../../../services/services/book.service";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-manage-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss'
})
export class ManageBookComponent implements OnInit{
  selectedPicture: string | undefined;
  selectedBookCover: any;
  bookRequest: BookRequest = {authorName: "", isbn: "", synopsis: "", title: ""};

  constructor(
    private bookService: BookService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
  }

  fileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    console.log(this.selectedBookCover);
    if (this.selectedBookCover) {
      const reader = new FileReader();
      reader.onload =() => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  protected readonly saveBook = saveBook;

  saveNewBook() {
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next:(bookId) => {
        this.bookService.uploadBookCover({
          "book-id": bookId,
          body: {
            file: this.selectedBookCover
          }
        }).subscribe({
          next: () => {
            this.toastr.success("Book added successfully", "Success");
            this.router.navigate(['/books/my-books']);
          }
        })
    },
      error: (err) => {
        this.toastr.error(err.error.validationErrors);
      }
    })
  }

  ngOnInit(): void {
    const bookId = this.route.snapshot.params['id'];
    if (bookId) {
      this.bookService.getBookById({
        "bookId": bookId
      }).subscribe({
        next: (bookResponse) => {
          this.bookRequest = {
            id: bookResponse.id,
            title: bookResponse.title as string,
            authorName: bookResponse.authorName as string,
            isbn: bookResponse.isbn as string,
            synopsis: bookResponse.synopsis as string,
            shareable: bookResponse.shareable
          }
          if (bookResponse.cover){
            this.selectedPicture = 'data:image/jpg;base64,' + bookResponse.cover;
          }
        }
      })
    }
  }
}
