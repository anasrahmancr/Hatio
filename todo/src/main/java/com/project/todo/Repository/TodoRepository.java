package com.project.todo.Repository;

import com.project.todo.Entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    Optional<Todo> findByTodoId(Long todoId);

    List<Todo> findAllByProjectProjectId(Long projectId);

    List<Todo> findAllByProjectProjectIdAndStatus(Long projectId, boolean b);
}
