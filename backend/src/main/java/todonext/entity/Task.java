package todonext.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "任务名称不能为空")
    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime deadline;

    private LocalDateTime completedAt;

    @ManyToOne
    private Group group;

    @ManyToMany
    private Set<Tag> tags;

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL)
    private List<Task> subTasks;

    @ManyToOne
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;

    // Constructors    
    public Task(String name) {
        this.name = name;
        this.createdAt = LocalDateTime.now();
    }
    // for test
    public Task(String name, String description, LocalDateTime deadline, LocalDateTime createdAt, LocalDateTime completedAt, Group group, Set<Tag> tags, List<Task> subTasks) {
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
        this.group = group;
        this.tags = tags;
        this.subTasks = subTasks;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public Group getGroup() {
        return group;
    }

    public Task getParentTask() {
        return parentTask;
    }

    public List<Task> getSubTasks() {
        return subTasks;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public void setParentTask(Task parentTask) {
        this.parentTask = parentTask;
    }

    public void setSubTasks(List<Task> subTasks) {
        this.subTasks = subTasks;
    }

    // 辅助方法
    public void addSubTask(Task subTask) {
        subTasks.add(subTask);
        subTask.setParentTask(this);
    }

    public void removeSubTask(Task subTask) {
        subTasks.remove(subTask);
        subTask.setParentTask(null);
    }
} 