package todonext.repository;

import todonext.entity.Task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByDeadlineBetween(LocalDateTime start, LocalDateTime end);
} 