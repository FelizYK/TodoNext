package todonext.service;

import todonext.entity.Task;
import todonext.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Map<LocalDate, List<Task>> getMonthlyTasks() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = today.withDayOfMonth(today.lengthOfMonth())
                                      .atTime(23, 59, 59);

        return repository.findByDeadlineBetween(startOfMonth, endOfMonth)
            .stream()
            .collect(Collectors.groupingBy(
                task -> task.getDeadline().toLocalDate()
            ));
    }
}