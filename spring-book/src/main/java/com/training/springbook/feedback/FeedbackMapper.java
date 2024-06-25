package com.training.springbook.feedback;

import com.training.springbook.book.Book;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class FeedbackMapper {
    public Feedback toFeedback(FeedbackRequest request) {
        return Feedback.builder()
                .note(request.note())
                .comment(request.comment())
                .book(Book.builder()
                        .id(request.bookId())
                        .archived(false)   // Not required and has no impact
                        .shareable(false)   // Not required and has no impact
                        .build()
                )
                .build();
    }


    public FeedbackResponse toFeedbackResponse(Feedback feedback, Integer id) {
        return FeedbackResponse.builder()
                .note(feedback.getNote())
                .comment(feedback.getComment())
                .ownFeedback(Objects.equals(feedback.getCreatedBy(), id))
                .build();
    }
}
