package com.training.springbook.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Integer> {

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.user.id = :userId
            """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, Integer userId);

    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.book.owner.id = :userId
            """)
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, Integer userId);
//
//    @Query("""
//            SELECT
//            (COUNT(*) > 0) AS isBorrowed
//            FROM BookTransactionHistory bookTransactionHistory
//            WHERE bookTransactionHistory.book.owner.id = :userId
//            AND bookTransactionHistory.book.id = :bookId
//            AND bookTransactionHistory.returnApproved = false
//            """)
    @Query("""
            SELECT 
            (COUNT(*) > 0) AS isBorrowed
            FROM BookTransactionHistory bookTransactionHistory
            WHERE bookTransactionHistory.book.id = :bookId
            AND bookTransactionHistory.returnApproved = false 
            """)
    boolean isAlreadyBorrowedByUser(Integer bookId);

    @Query("""
            SELECT bookTransactionHistory
            FROM BookTransactionHistory bookTransactionHistory
            WHERE bookTransactionHistory.book.id = :bookId
            AND bookTransactionHistory.user.id = :userId
            AND bookTransactionHistory.returned = false
            AND bookTransactionHistory.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIdAndUserId(Integer bookId, Integer userId);

    @Query("""
            SELECT bookTransactionHistory
            FROM BookTransactionHistory bookTransactionHistory
            WHERE bookTransactionHistory.book.id = :bookId
            AND bookTransactionHistory.book.owner.id = :ownerId
            AND bookTransactionHistory.returned = true
            AND bookTransactionHistory.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(Integer bookId, Integer ownerId);
}
