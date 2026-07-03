package com.calendar_backend.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "user_groups") // Schimbă numele din 'group' în 'user_groups'
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "group_members",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Event> events;

    // În Group.java

    private Long adminId; // Câmpul care va stoca ID-ul administratorului

    // Getter pentru adminId
    public Long getAdminId() {
        return adminId;
    }

    // Setter pentru adminId
    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
}
