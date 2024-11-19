package todonext.controller;

import todonext.entity.Task;
import todonext.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Controller
public class ViewController {

  @Autowired
  private TaskService taskService;

  @GetMapping("/")
  public String listView(Model model) {
      // 获取所有任务
      List<Task> tasks = taskService.getAllTasks();
      model.addAttribute("tasks", tasks);
      return "list-view";
  }

  @GetMapping("/month")
  public String monthView(Model model) {
      // 获取当月任务
      Map<LocalDate, List<Task>> monthlyTasks = taskService.getMonthlyTasks();
      model.addAttribute("monthlyTasks", monthlyTasks);
      return "month-view";
  }
}