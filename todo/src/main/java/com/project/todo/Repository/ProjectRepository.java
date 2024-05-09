package com.project.todo.Repository;

import com.project.todo.Entity.Project;
import com.project.todo.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByProjectId(Long projectId);

	List<Project> findAllByUserUserId(Long userId);
}
