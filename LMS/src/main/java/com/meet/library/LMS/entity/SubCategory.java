package com.meet.library.LMS.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.meet.library.LMS.exception.BadRequestException;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sub_category")
public class SubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subCategoryId;

    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @ManyToOne
    @JoinColumn(name = "category_id",nullable = false)
    @JsonBackReference
    private Category category;

    @OneToMany(mappedBy = "subCategories",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Book> book=new ArrayList<>();

    public void addBook(Book bookdto){
       bookdto.setSubCategories(this);
       book.add(bookdto);
    }

    public void removeBook(Book book){
        this.book.remove(book);
        book.setSubCategories(null);
    }
}
