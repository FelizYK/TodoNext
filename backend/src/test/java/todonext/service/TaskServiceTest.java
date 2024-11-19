package todonext.service;

import todonext.entity.Task;
import todonext.repository.TaskRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task createTaskWithDeadline(String name, LocalDate date) {
        Task task = new Task(name);
        task.setDeadline(date.atStartOfDay());
        return task;
    }

    @Test
    void testGetAllTasks() {
        // 准备测试数据
        List<Task> tasks = Arrays.asList(
                new Task("Task 1"),
                new Task("Task 2")
        );
        when(taskRepository.findAll()).thenReturn(tasks);

        // 执行测试
        List<Task> result = taskService.getAllTasks();

        // 验证结果
        assertEquals(2, result.size());
        assertEquals("Task 1", result.get(0).getName());
        assertEquals("Task 2", result.get(1).getName());
        verify(taskRepository).findAll();
    }

    @Test
    void testGetMonthlyTasks() {
        // 准备测试数据
        LocalDate today = LocalDate.now();
        List<Task> allTasks = Arrays.asList(
                createTaskWithDeadline("Today's Task", today),
                createTaskWithDeadline("Next Month's Task", today.plusMonths(1)),
                createTaskWithDeadline("Last Month's Task", today.minusMonths(1))
        );

        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = today.withDayOfMonth(today.lengthOfMonth())
                .atTime(23, 59, 59);
        when(taskRepository.findByDeadlineBetween(startOfMonth, endOfMonth))
                .thenReturn(Arrays.asList(createTaskWithDeadline("Today's Task", today)));

        // 执行测试
        Map<LocalDate, List<Task>> monthlyTasks = taskService.getMonthlyTasks();

        // 验证结果
        assertEquals(1, monthlyTasks.size());
        assertTrue(monthlyTasks.containsKey(today));
        assertEquals(1, monthlyTasks.get(today).size());
        assertEquals("Today's Task", monthlyTasks.get(today).get(0).getName());
    }
}
