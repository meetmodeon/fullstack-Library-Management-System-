package com.meet.library.LMS.entity;

import com.meet.library.LMS.enums.PaymentStatus;
import jakarta.persistence.OneToOne;

public class Payment {
    private Long paymentId;
    private PaymentStatus paymentStatus;
    @OneToOne
    private User user;
    @OneToOne
    private Book book;
}

