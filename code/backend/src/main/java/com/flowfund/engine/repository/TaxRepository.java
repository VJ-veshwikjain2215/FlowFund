package com.flowfund.engine.repository;

import com.flowfund.engine.entity.Tax;
import com.flowfund.engine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TaxRepository extends JpaRepository<Tax, Long> {
    Optional<Tax> findByUser(User user);
}
