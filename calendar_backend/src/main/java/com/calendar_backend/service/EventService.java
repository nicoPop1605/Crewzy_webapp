package com.calendar_backend.service;

import com.calendar_backend.model.Event;
import com.calendar_backend.model.User;
import com.calendar_backend.repository.EventRepository;
import com.calendar_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repo;
    private final UserRepository userRepository;

    public EventService(EventRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    public List<Event> getAll() {
        return repo.findAll();
    }

    public Event create(Event event) {

        if (event.getEndDateTime().isBefore(event.getStartDateTime())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        return repo.save(event);
    }

    public boolean existsById(Long id) {
        return repo.existsById(id);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public Event update(Long id, Event updatedEvent) {
        Event existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Validare end > start
        if (updatedEvent.getEndDateTime().isBefore(updatedEvent.getStartDateTime())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        existing.setTitle(updatedEvent.getTitle());
        existing.setDescription(updatedEvent.getDescription());
        existing.setStartDateTime(updatedEvent.getStartDateTime());
        existing.setEndDateTime(updatedEvent.getEndDateTime());
        existing.setLocation(updatedEvent.getLocation());
        existing.setGroup(updatedEvent.getGroup());

        return repo.save(existing);
    }


    // În EventService.java
// Ai nevoie de UserRepository injectat aici pentru a găsi utilizatorul

    public Event addParticipant(Long eventId, Long userId) {
        Event event = repo.findById(eventId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        if (!event.getParticipants().contains(user)) {
            event.getParticipants().add(user);
        }
        return repo.save(event);
    }

    public Event removeParticipant(Long eventId, Long userId) {
        Event event = repo.findById(eventId).orElseThrow();
        event.getParticipants().removeIf(u -> u.getId().equals(userId));
        return repo.save(event);
    }
}
