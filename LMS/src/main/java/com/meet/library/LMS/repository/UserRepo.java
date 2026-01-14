package com.meet.library.LMS.repository;

import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Long> {
  Optional<User> findByEmailAndPassword(String email, String password);

  Optional<User> findByUserId(Long userId);

  Page<User> findByUserRole(UserRole userRole, Pageable page);

    Optional<User> findByEmail(String username);
}
