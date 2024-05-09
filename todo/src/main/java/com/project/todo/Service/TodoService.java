package com.project.todo.Service;

import com.project.todo.Entity.Project;
import com.project.todo.Entity.Todo;
import com.project.todo.Repository.TodoRepository;
import com.project.todo.dto.TodoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    //Create a todo
    public ResponseEntity<String> createTodo(TodoDto todo, Optional<Project> existingProject) {
        Todo newTodo = new Todo();
        newTodo.setDescription(todo.getDescription());
        newTodo.setStatus(false);
        newTodo.setCreatedDate(LocalDate.now());
        newTodo.setUpdatedDate(LocalDate.now());
        newTodo.setProject(existingProject.get());
        todoRepository.save(newTodo);
        return ResponseEntity.status(HttpStatus.CREATED).body("Todo Created");
    }

    //Find todo by todo_id
    public Optional<Todo> findTodoById(Long todoId) {
        return todoRepository.findByTodoId(todoId);

    }

    //Update the todo
    public ResponseEntity<String> updateTodo(Optional<Todo> existingTodo, TodoDto todo) {
        Todo newTodo = existingTodo.get();
        if (todo.getDescription() != null) {
            newTodo.setDescription(todo.getDescription());
        }
        if (todo.getStatus() != null) {
            newTodo.setStatus(todo.getStatus());
        }
        newTodo.setUpdatedDate(LocalDate.now());
        todoRepository.save(newTodo);
        return ResponseEntity.status(HttpStatus.OK).body("Updated");
    }

    //Delete a todo
    public ResponseEntity<String> deleteTodo(Optional<Todo> existingTodo) {
        todoRepository.delete(existingTodo.get());
        return ResponseEntity.status(HttpStatus.OK).body("Deleted");
    }

    //Get all todos using project_id
    public List<Todo> getAllTodosByProjectId(Long projectId) {
        return todoRepository.findAllByProjectProjectId(projectId);
    }

    //Get all pending Todos
    public List<Todo> findAllPendingTodos(Long projectId) {
        return todoRepository.findAllByProjectProjectIdAndStatus(projectId, false);
    }

    //Get all completed todos
    public List<Todo> findAllCompletedTodos(Long projectId) {
        return todoRepository.findAllByProjectProjectIdAndStatus(projectId, true);
    }
}
