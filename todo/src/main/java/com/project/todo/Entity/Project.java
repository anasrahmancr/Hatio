package com.project.todo.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq_generator")
    @SequenceGenerator(name="project_seq_generator", sequenceName = "project_seq", allocationSize=1)
    private Long projectId;
    private String title;
    private LocalDate createDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
	private List<Todo> todos;

    @Override
    public String toString() {
        return "Project{" +
                "projectId=" + projectId +
                ", title='" + title + '\'' +
                ", createDate=" + createDate +
                ", user=" + user +
                ", todos=" + todos +
                '}';
    }
}
