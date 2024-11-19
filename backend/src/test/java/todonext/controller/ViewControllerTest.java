package todonext.controller;

import todonext.entity.Task;
import todonext.service.TaskService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebMvcTest(controllers = ViewController.class)
class ViewControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Test
    void testListView() throws Exception {
        // 准备测试数据
        List<Task> tasks = Arrays.asList(
                new Task("Task 1"),
                new Task("Task 2")
        );
        when(taskService.getAllTasks()).thenReturn(tasks);

        // 执行测试
        mockMvc.perform(get("/"))
                .andDo(print())  // 打印请求和响应详情
                .andExpect(status().isOk())
                .andExpect(view().name("list-view"))
                .andExpect(model().attributeExists("tasks"))
                .andExpect(model().attribute("tasks", tasks));
    }

    @Test
    void testMonthView() throws Exception {
        // 准备测试数据
        Map<LocalDate, List<Task>> monthlyTasks = new HashMap<>();
        monthlyTasks.put(LocalDate.now(), Arrays.asList(
                new Task("Today's Task1"),
                new Task("Today's Task2")
        ));
        when(taskService.getMonthlyTasks()).thenReturn(monthlyTasks);

        // 执行测试
        mockMvc.perform(get("/month"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(view().name("month-view"))
                .andExpect(model().attributeExists("monthlyTasks"))
                .andExpect(model().attribute("monthlyTasks", monthlyTasks));
    }
} 