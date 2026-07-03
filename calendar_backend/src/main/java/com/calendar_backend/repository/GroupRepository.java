package com.calendar_backend.repository;

import com.calendar_backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    // JpaRepository oferă deja metodele standard: findAll(), findById(), save(), deleteById()

}