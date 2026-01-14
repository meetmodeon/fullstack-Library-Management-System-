package com.meet.library.LMS.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.meet.library.LMS.exception.BadRequestException;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    private String name;
    @OneToMany(mappedBy = "category",fetch = FetchType.LAZY,cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private Set<SubCategory> subCategories=new HashSet<>();

    public void addSubCategory(SubCategory subCategory){
        this.subCategories.add(subCategory);
    }

    public void removeSubCategory(SubCategory subCategory){
       this.subCategories.remove(subCategory);
       subCategory.setCategory(null);
    }
}
