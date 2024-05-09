package com.project.todo.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_generator")
    @SequenceGenerator(name="user_seq_generator", sequenceName = "user_seq", allocationSize=1)
    private Long userId;
    private String username;
    @Column(unique = true)
    private String email;
    private String password;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
	private List<Project> projects;

    @Override
    public String toString() {
        return "Users{" +
                "userId=" + userId +
                '}';
    }
}
