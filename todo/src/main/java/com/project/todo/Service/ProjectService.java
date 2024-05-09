package com.project.todo.Service;

import com.project.todo.Entity.Project;
import com.project.todo.Entity.Todo;
import com.project.todo.Entity.User;
import com.project.todo.Repository.ProjectRepository;
import com.project.todo.Repository.UserRepository;
import org.kohsuke.github.GHGist;
import org.kohsuke.github.GHGistBuilder;
import org.kohsuke.github.GitHub;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TodoService todoService;

    @Autowired
    private UserRepository userRepository;

    //create a new project
    public void createProject(Project project, Long userId) {
        User user = userRepository.findById(userId).orElse(null);

        Project newProject = new Project();
        newProject.setTitle(project.getTitle());
        newProject.setCreateDate(LocalDate.now());
        newProject.setUser(user);
        projectRepository.save(newProject);
    }

    //Return project object by project_id
    public Optional<Project> findProjectById(Long projectId) {
        return projectRepository.findByProjectId(projectId);

    }

    //Update the title of the project
    public ResponseEntity<String> updateTitle(Project project, Optional<Project> existingProject) {
        Project updatedProject = existingProject.get();
        updatedProject.setTitle(project.getTitle());
        projectRepository.save(updatedProject);
        return ResponseEntity.ok().body("Updated");
    }

    //delete the given project
    public ResponseEntity<String> deleteProject(Optional<Project> existingProject) {
        projectRepository.delete(existingProject.get());
        return ResponseEntity.status(HttpStatus.OK).body("Project Deleted");
    }

    //Return all project using user_id
    public List<Project> getAllProjectsByUserId(Long userId) {
        return projectRepository.findAllByUserUserId(userId);
    }

    //Returns the markdown content
    public String toMarkdown(Long projectId, Optional<Project> project) {
        StringBuilder markdownContent = new StringBuilder();

        markdownContent.append("# ").append(project.get().getTitle()).append("\n\n");
        List<Todo> completedTodos = todoService.findAllCompletedTodos(projectId);
        List<Todo> pendingTodos = todoService.findAllPendingTodos(projectId);

        int totalCount = completedTodos.size() + pendingTodos.size();

        markdownContent.append("## Summary: ")
                .append(completedTodos.size()).append(" / ").append(totalCount).append(" todos completed.\n\n");

        markdownContent.append("## Pending\n");
        appendTodoList(markdownContent, pendingTodos);

        markdownContent.append("\n## Completed\n");
        appendTodoList(markdownContent, completedTodos);

        // Write content to file
//        try (FileWriter writer = new FileWriter(project.get().getTitle() + ".md")) {
//            writer.write(markdownContent.toString());
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        return markdownContent.toString();
    }

    //To display checkbox
    private static void appendTodoList(StringBuilder markdownContent, List<Todo> todos) {
        for (Todo todo : todos) {
            markdownContent.append("- [").append(todo.getStatus() ? "x" : " ").append("] ")
                    .append(todo.getDescription()).append("\n");
        }
    }

    //To download md file
    public ResponseEntity<?> downloadMarkdown(String markdownContent, String fileName) {
        byte[] markdownBytes = markdownContent.getBytes();

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(markdownContent.getBytes()));

        // Set headers for attachment download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);

    }

    public ResponseEntity<String> getGistUrl(String githubToken, Optional<Project> project, Long projectId) {
        try {

            GitHub github = GitHub.connectUsingOAuth(githubToken);
            GHGistBuilder builder = github.createGist();
            builder.description("Project Summary");
            builder.file(project.get().getTitle(), toMarkdown(projectId, project));

            GHGist gist = builder.create();

            String gistUrl = gist.getHtmlUrl().toString();
            return ResponseEntity.ok(gistUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error exporting summary as gist");
        }
    }
}


