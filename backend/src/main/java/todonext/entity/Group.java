package todonext.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "task_groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String color;
    
    @OneToMany(mappedBy = "group")
    private Set<Task> tasks;
    
    // Constructors
    public Group() {
    }
    
    public Group(String name, String color) {
        this.name = name;
        this.color = color;
        this.tasks = new HashSet<>();
    }
    
    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
    
    public String getColor() {
        return color;
    }

    public Set<Task> getTasks() {
        return tasks;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setColor(String color) {
        this.color = color;
    }

    public void addTask(Task task) {
        this.tasks.add(task);
    }
} 