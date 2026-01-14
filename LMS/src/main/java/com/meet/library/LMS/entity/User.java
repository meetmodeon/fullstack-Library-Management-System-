package com.meet.library.LMS.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.meet.library.LMS.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String phoneNumber;


    private String password;
    private String profileImagePath;

    @ElementCollection(targetClass = UserRole.class,fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles",joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "user_roles")
    private Set<UserRole> userRole;
    @OneToMany(mappedBy = "user",orphanRemoval = true,cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Borrowed> borrowed=new ArrayList<>();
    @OneToMany(mappedBy = "user",orphanRemoval = true,cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<RatingFeedback> ratingFeedbacks=new ArrayList<>();



    public void addRating(RatingFeedback ratingRequest){
        ratingFeedbacks.add(ratingRequest);
        ratingRequest.setUser(this);
    }

    public void removeRating(RatingFeedback ratingRequest){
        ratingFeedbacks.remove(ratingRequest);
        ratingRequest.setUser(null);
    }


}
