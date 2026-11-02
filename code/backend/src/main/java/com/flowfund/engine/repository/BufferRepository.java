package com.flowfund.engine.repository;

import com.flowfund.engine.entity.Buffer;
import com.flowfund.engine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BufferRepository extends JpaRepository<Buffer, Long> {
    Optional<Buffer> findByUser(User user);
}
