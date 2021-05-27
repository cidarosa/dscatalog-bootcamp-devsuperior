package com.devsuperior.dscatalog.services;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.devsuperior.dscatalog.dto.ProductDTO;
import com.devsuperior.dscatalog.entities.Category;
import com.devsuperior.dscatalog.entities.Product;
import com.devsuperior.dscatalog.repositories.CategoryRepository;
import com.devsuperior.dscatalog.repositories.ProductRepository;
import com.devsuperior.dscatalog.services.exceptions.DataBaseException;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;
import com.devsuperior.dscatalog.tests.Factory;

@ExtendWith(SpringExtension.class)
public class ProductServiceTests {

	@InjectMocks
	private ProductService service;

	@Mock
	private ProductRepository repository;

	// simulação da Categoria para Produto - para updade
	@Mock
	private CategoryRepository categoryRepository;

	private long existingId;
	private long nonExistingId;
	private long dependentId;
	private PageImpl<Product> page;
	private Product product;
	private Category category;
	private ProductDTO productDTO;

	@BeforeEach
	void setUp() throws Exception {
		existingId = 1L;
		nonExistingId = 2L;
		dependentId = 3L;

		product = Factory.createProduct();
		category = Factory.createCategory();
		productDTO = Factory.createProductDTO();

		page = new PageImpl<>(List.of(product));

		// simular comportamento do findAll
		// retornar uma página

		// método não é void - com retorno

		Mockito.when(repository.findAll((Pageable) ArgumentMatchers.any())).thenReturn(page);

		Mockito.when(repository.save(ArgumentMatchers.any())).thenReturn(product);

		// optional
		// findById - 2 cenários - Id existente e Id não existente
		Mockito.when(repository.findById(existingId)).thenReturn(Optional.of(product));

		Mockito.when(repository.findById(nonExistingId)).thenReturn(Optional.empty());

		// Update Product - precisa do CategoryRepository
		Mockito.when(repository.getOne(existingId)).thenReturn(product);
		Mockito.when(repository.getOne(nonExistingId)).thenThrow(EntityNotFoundException.class);

		Mockito.when(categoryRepository.getOne(existingId)).thenReturn(category);
		Mockito.when(categoryRepository.getOne(nonExistingId)).thenThrow(EntityNotFoundException.class);

		// compartmanento simulado
		// configurando o repository mockado

		// não faça nada (void) quando ...
		Mockito.doNothing().when(repository).deleteById(existingId);

		// lança exception qdo ID não existe
		Mockito.doThrow(EmptyResultDataAccessException.class).when(repository).deleteById(nonExistingId);
		Mockito.doThrow(DataIntegrityViolationException.class).when(repository).deleteById(dependentId);

	}

	@Test
	public void deleteShouldDoNothingWhenIdExists() {

		Assertions.assertDoesNotThrow(() -> {
			service.delete(existingId);
		});

		// verifica se o método delteById do repository que está mokado, na ação acima
		Mockito.verify(repository, Mockito.times(1)).deleteById(existingId);

	}

	@Test
	public void deleteShouldThrowResourceNotFoundExcenptionWhenIdDoesNotExists() {

		Assertions.assertThrows(ResourceNotFoundException.class, () -> {
			service.delete(nonExistingId);
		});

		// verifica se o método delteById do repository que está mokado, na ação acima
		Mockito.verify(repository, Mockito.times(1)).deleteById(nonExistingId);

	}

	@Test
	public void deleteShouldThrowDatabaseExcenptionWhenIntegrityViolation() {

		Assertions.assertThrows(DataBaseException.class, () -> {
			service.delete(dependentId);
		});

		// verifica se o método delteById do repository que está mokado, na ação acima
		Mockito.verify(repository, Mockito.times(1)).deleteById(dependentId);

	}

	// test do FindAllPaged
	@Test
	public void findAllPagedShouldReturnPage() {

		// instanciando um Pageable
		Pageable pageable = PageRequest.of(0, 10);

		Page<ProductDTO> result = service.findAllPaged(pageable);

		Assertions.assertNotNull(result);

		Mockito.verify(repository, Mockito.times(1)).findAll(pageable);

	}

	@Test
	public void findByIdShoulReturnProductDTOWhenIdExists() {

		ProductDTO result = service.findById(existingId);
		Assertions.assertNotNull(result);
		// Mockito.verify(repository).findById(existingId);
	}

	@Test
	public void findByIdShoulThrowResourceNotFoundExceptionWhenIdDoesNotExists() {

		Assertions.assertThrows(ResourceNotFoundException.class, () -> {
			service.findById(nonExistingId);
		});

		// Mockito.verify(repository).findById(nonExistingId);
	}

	@Test
	public void updateShoulReturnProductDTOWhenIdExists() {

		// ProductDTO productDTO = Factory.createProductDTO();

		ProductDTO result = service.update(existingId, productDTO);
		Assertions.assertNotNull(result);
		// Mockito.verify(repository).findById(existingId);
	}

	@Test
	public void updateShoulThrowResourceNotFoundExceptionWhenIdDoesNotExists() {

		// ProductDTO productDTO = Factory.createProductDTO();

		Assertions.assertThrows(ResourceNotFoundException.class, () -> {
			service.update(nonExistingId, productDTO);
		});

	}

}
