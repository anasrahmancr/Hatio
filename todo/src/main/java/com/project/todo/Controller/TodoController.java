package com.project.todo.Controller;

import com.project.todo.Entity.Project;
import com.project.todo.Entity.Todo;
import com.project.todo.Service.ProjectService;
import com.project.todo.Service.TodoService;
import com.project.todo.dto.TodoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todo")
public class TodoController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TodoService todoService;

    //Get all todos of the project
    @GetMapping("/{projectId}/getAllTodos")
    public ResponseEntity<List<Todo>> getAllTodo(@PathVariable Long projectId) {
        if (projectId == 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        List<Todo> todos = todoService.getAllTodosByProjectId(projectId);
        return ResponseEntity.status(HttpStatus.OK).body(todos);
    }

    //create a todo
    @PostMapping("/{projectId}/create")
    public ResponseEntity<String> createTodo(@RequestBody TodoDto todo, @PathVariable Long projectId) {
        Optional<Project> existingProject = projectService.findProjectById(projectId);

        if(existingProject.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project Not found");
        }
        return todoService.createTodo(todo, existingProject);
    }

    //Update the todo
    @PutMapping("/update/{todoId}")
    public ResponseEntity<String> updateTodo(@RequestBody TodoDto todo, @PathVariable Long todoId) {
        Optional<Todo> existingTodo = todoService.findTodoById(todoId);

        if(existingTodo.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
        return todoService.updateTodo(existingTodo, todo);
    }

    //Delete todo
    @DeleteMapping("/delete/{todoId}")
    public ResponseEntity<String> deleteTodo(@PathVariable Long todoId) {
        Optional<Todo> existingTodo = todoService.findTodoById(todoId);

        if(existingTodo.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
        return todoService.deleteTodo(existingTodo);
    }

}
