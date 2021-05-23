package com.devsuperior.dscatalog.repositories;

import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.EmptyResultDataAccessException;

import com.devsuperior.dscatalog.entities.Product;

@DataJpaTest
public class ProductRepositoryTests {

	@Autowired
	private ProductRepository repository;

	// qdo existe
	@Test
	public void deleteShouldDeleteObjectWhenIdExists() {
		
		Long existingId = 1L;
		repository.deleteById(existingId);
		Optional<Product> result = repository.findById(existingId);
		Assertions.assertFalse(result.isPresent()); // isPresent testa se tem um obj dentro do Optional
	}

	@Test
	public void deleteShouldThrowEmptyResultDataAccessExceptiontWhenIdNotExists() {

		Long noExistingId = 1000L;
		Assertions.assertThrows(EmptyResultDataAccessException.class, () -> {
			repository.deleteById(noExistingId);
		});
	}

}
