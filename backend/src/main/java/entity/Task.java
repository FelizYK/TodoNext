package entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    @ManyToOne
    private Group group;
    
    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL)
    private List<Task> subTasks;
    
    @ManyToMany
    private Set<Tag> tags;
    
    // Constructors
    public Task() {
    }
    
    public Task(String name, String description, LocalDateTime deadline, LocalDateTime createdAt, LocalDateTime completedAt, Group group) {
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
        this.group = group;
        this.subTasks = new ArrayList<>();
        this.tags = new HashSet<>();
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

    public List<Task> getSubTasks() {
        return subTasks;
    }

    public Set<Tag> getTags() {
        return tags;
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

    public void setSubTask(Task subTask) {
        this.subTasks.add(subTask);
    }

    public void setTag(Tag tag) {
        this.tags.add(tag);
    }
} 