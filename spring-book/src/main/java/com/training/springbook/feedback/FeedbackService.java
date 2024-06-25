package com.training.springbook.feedback;

import com.training.springbook.book.Book;
import com.training.springbook.book.BookRepository;
import com.training.springbook.common.PageResponse;
import com.training.springbook.exception.OperationNotPermittedException;
import com.training.springbook.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final BookRepository bookRepository;
    private final FeedbackRepository repository;
    private final FeedbackMapper mapper;
    public Integer saveFeedback(FeedbackRequest request, Authentication connectedUser) {

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new EntityNotFoundException("Book with provided id doesn't exist"));
        if (book.isArchived() || !book.isShareable()){
            throw new OperationNotPermittedException("You cannot provide feedback to archived or not shareable book");
        }

        User user = (User) connectedUser.getPrincipal();
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot give feedback to your own book");
        }

        Feedback feedback = mapper.toFeedback(request);
        return repository.save(feedback).getId();

    }

    public PageResponse<FeedbackResponse> findFeedbacksByBook(
            Integer bookId,
            int page,
            int size,
            Authentication connectedUser
    ) {

        Pageable pageable = PageRequest.of(page, size);
        User user = (User) connectedUser.getPrincipal();

        Page<Feedback> feedbacks = repository.findAllByBookId(bookId, pageable);
        List<FeedbackResponse> feedbackResponses = feedbacks.stream()
                .map(feedback -> mapper.toFeedbackResponse(feedback, user.getId())).toList();
        return new PageResponse<>(
                feedbackResponses,
                feedbacks.getNumber(),
                feedbacks.getSize(),
                feedbacks.getTotalElements(),
                feedbacks.getTotalPages(),
                feedbacks.isFirst(),
                feedbacks.isLast()
                );
    }
}
