//package controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import entity.Task;
//import service.TaskService;
//
//@RestController
//@RequestMapping("/api/tasks")
//public class TaskController {
//    @Autowired
//    private TaskService taskService;
//
//    @PostMapping
//    public Task createTask(@RequestBody Task task) {
//        return taskService.createTask(task);
//    }
//
//    @PutMapping("/{id}")
//    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
//        return taskService.updateTask(id, task);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteTask(@PathVariable Long id) {
//        taskService.deleteTask(id);
//    }
//}