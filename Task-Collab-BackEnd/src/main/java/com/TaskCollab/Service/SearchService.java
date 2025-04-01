package com.TaskCollab.Service;

import com.TaskCollab.Entity.Task;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

   @PersistenceContext
    private EntityManager entityManager;  // Inject EntityManager

    public List<Task> searchTasks(String task_Title, String description, String assigned_To, String status, String deadline) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Task> query = cb.createQuery(Task.class);
        Root<Task> task = query.from(Task.class);

        System.out.println("Received params ->");
        System.out.println("Title: " + task_Title);
        System.out.println("Description: " + description);
        System.out.println("Assigned To: " + assigned_To);
        System.out.println("Status: " + status);
        System.out.println("Deadline: " + deadline);

        List<Predicate> predicates = new ArrayList<>();

        if (task_Title != null && !task_Title.trim().isEmpty()) {
            predicates.add(cb.equal(cb.lower(task.get("task_Title")), task_Title.toLowerCase()));
        }
        if (description != null && !description.isEmpty()) {
            predicates.add(cb.equal(cb.lower(task.get("description")), description.toLowerCase()));
        }
        if (assigned_To != null && !assigned_To.isEmpty()) {
            predicates.add(cb.equal(task.get("assigned_To"), assigned_To));
        }
        if (status != null && !status.isEmpty()) {
            predicates.add(cb.equal(task.get("status"), status));
        }
        if (deadline != null && !deadline.isEmpty()) {
            try {
                LocalDateTime deadlineParsed = LocalDateTime.parse(deadline, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                predicates.add(cb.equal(task.get("deadline"), deadlineParsed));
            } catch (Exception e) {
                System.out.println("Invalid deadline format: " + deadline);
            }
        }

        query.select(task).where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}
    