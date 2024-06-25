package com.training.springbook.feedback;

import com.training.springbook.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("feedbacks")
@Tag(name = "Feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Integer> saveFeedback(
            @Valid @RequestBody FeedbackRequest feedback,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(feedbackService.saveFeedback(feedback, connectedUser));
    }

    @GetMapping("/books/{book-id}")
    public ResponseEntity<PageResponse<FeedbackResponse>> findFeedbacksByBook(
            @PathVariable("bookId") Integer bookId,
            @RequestParam (name = "page", defaultValue = "0", required = false) int page,
            @RequestParam (name = "size", defaultValue = "10", required = false) int size,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(feedbackService.findFeedbacksByBook(bookId, page, size, connectedUser));
    }
}
