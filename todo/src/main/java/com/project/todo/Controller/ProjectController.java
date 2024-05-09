package com.project.todo.Controller;

import com.project.todo.Entity.Project;
import com.project.todo.Service.ProjectService;
import com.project.todo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Value("${GITHUB_TOKEN}")
    private String gitHubToken;

    //To Create a new project for the logged-in user
    @PostMapping("/create")
    public ResponseEntity<String> createProject(@RequestBody Project project, @CookieValue(value = "userId", defaultValue = "0") Long userId){
        if (userId == 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        projectService.createProject(project, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body("Project is created");
    }

    //Update the existing project Title
    @PutMapping("/update/{projectId}")
    public ResponseEntity<String> updateTitle(@RequestBody Project project, @PathVariable Long projectId){
        Optional<Project> existingProject = projectService.findProjectById(projectId);
        if(existingProject.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project Not Found");
        }
        return projectService.updateTitle(project, existingProject);
    }

    //Returns all projects for the logged-in user
    @GetMapping("/getAllProjects")
    public ResponseEntity<List<Project>> getAllProjects(@CookieValue(value = "userId", defaultValue = "0") Long userId){
    	if (userId == 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    	List<Project> projects = projectService.getAllProjectsByUserId(userId);
    	return ResponseEntity.status(HttpStatus.OK).body(projects);
    }

    //Delete that particular project
    @DeleteMapping("/delete/{projectId}")
    public ResponseEntity<String> deleteProject(@PathVariable Long projectId) {
        Optional<Project> existingProject = projectService.findProjectById(projectId);
        if(existingProject.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project Not Found");
        }
        return projectService.deleteProject(existingProject);
    }

    //Returns the project associated with the given projectId
    @GetMapping("/getProject/{projectId}")
    public ResponseEntity<Optional<Project>> getProject(@PathVariable Long projectId) {
        if (projectId == 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Optional<Project> project = projectService.findProjectById(projectId);
        return  ResponseEntity.status(HttpStatus.OK).body(project);
    }

    //Returns the gist Url
    @PostMapping("/exportSummary/{projectId}")
    public ResponseEntity<String> exportSummaryToGist(@PathVariable Long projectId) {

            Optional<Project> project = projectService.findProjectById(projectId);

            ResponseEntity<String> gistUrl = projectService.getGistUrl(gitHubToken,project,projectId);

            return gistUrl;

    }

    //To download the file
    @GetMapping("/downloadSummary/{projectId}")
    public ResponseEntity<?> downloadMarkdownFile(@PathVariable Long projectId) {
        try {
            Optional<Project> project = projectService.findProjectById(projectId);
            String fileName = project.get().getTitle() + ".md";
            String markdownContent = projectService.toMarkdown(projectId, project);

            return projectService.downloadMarkdown(markdownContent, fileName);

        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error downloading file");
        }
    }

}
