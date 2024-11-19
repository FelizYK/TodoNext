package todonext.repository;

import todonext.entity.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TaskRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TaskRepository taskRepository;

    private Task createTaskWithDeadline(String name, LocalDate date) {
        Task task = new Task(name);
        task.setDeadline(date.atStartOfDay());
        return task;
    }

    @Test
    void testFindByDeadlineBetween() {
        // 准备测试数据
        LocalDate today = LocalDate.now();
        Task todayTask = createTaskWithDeadline("Today's Task", today);
        Task nextMonthTask = createTaskWithDeadline("Next Month's Task", today.plusMonths(1));
        Task lastMonthTask = createTaskWithDeadline("Last Month's Task", today.minusMonths(1));

        entityManager.persist(todayTask);
        entityManager.persist(nextMonthTask);
        entityManager.persist(lastMonthTask);
        entityManager.flush();

        // 设置查询时间范围
        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = today.withDayOfMonth(today.lengthOfMonth())
                .atTime(23, 59, 59);

        // 执行测试
        List<Task> foundTasks = taskRepository.findByDeadlineBetween(startOfMonth, endOfMonth);

        // 验证结果
        assertEquals(1, foundTasks.size());
        assertEquals("Today's Task", foundTasks.get(0).getName());
    }

    @Test
    void testBasicCRUDOperations() {
        // 测试创建
        Task task = new Task("Test Task");
        Task savedTask = taskRepository.save(task);
        assertNotNull(savedTask.getId());
        
        // 测试查询
        Task foundTask = taskRepository.findById(savedTask.getId()).orElse(null);
        assertNotNull(foundTask);
        assertEquals("Test Task", foundTask.getName());
        
        // 测试更新
        foundTask.setName("Updated Task");
        Task updatedTask = taskRepository.save(foundTask);
        assertEquals("Updated Task", updatedTask.getName());
        
        // 测试删除
        taskRepository.delete(updatedTask);
        assertTrue(taskRepository.findById(updatedTask.getId()).isEmpty());
    }
}
