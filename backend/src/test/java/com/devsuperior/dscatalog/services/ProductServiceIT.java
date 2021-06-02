package com.devsuperior.dscatalog.services;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dscatalog.dto.ProductDTO;
import com.devsuperior.dscatalog.repositories.ProductRepository;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;

@SpringBootTest
@Transactional //dá rollback no DB
public class ProductServiceIT {

	// o service não vai ser mockado, vai ser injetado
	@Autowired
	private ProductService service;

	@Autowired
	private ProductRepository repository;

	// variáveis para o teste

	private Long existingId;
	private Long nonExistingId;
	private Long countTotalProducts;

	@BeforeEach
	void setUp() throws Exception {

		existingId = 1L;
		nonExistingId = 1000L;
		countTotalProducts = 25L;

	}

	@Test
	public void deleteShouldDeleteResourceWhenIdExists() {
		service.delete(existingId);
		// Assertion
		// contar para ver se deletou

		Assertions.assertEquals(countTotalProducts - 1, repository.count());
	}

	@Test
	public void deleteShouldThrowResourceNotFoundExceptionWhenIdDoesNotExists() {
		Assertions.assertThrows(ResourceNotFoundException.class, () -> service.delete(nonExistingId));
	}

	@Test
	public void findAllPagedShouldReturnPageWhenPage0Size10() {

		// página 0, tamanho 10
		PageRequest pageRequest = PageRequest.of(0, 10);

		Page<ProductDTO> result = service.findAllPaged(pageRequest);

		Assertions.assertFalse(result.isEmpty()); // testa se page não é vazio
		Assertions.assertEquals(0, result.getNumber()); // verifica se o número da página é zero - primeira página
		Assertions.assertEquals(10, result.getSize()); // verifica se tem 10 elementos na página
		Assertions.assertEquals(countTotalProducts, result.getTotalElements()); // verifica o número total de registros

	}
	
	@Test
	public void findAllPagedShouldReturnEmptyPageWhenPageDoesNotExists() {

		// página 50, tamanho 10
		PageRequest pageRequest = PageRequest.of(50, 10);
		Page<ProductDTO> result = service.findAllPaged(pageRequest);
		Assertions.assertTrue(result.isEmpty()); // testa se page é vazio
	}
	
	@Test
	public void findAllPagedShouldReturnSortedPageWhenSortedByName() {		
		PageRequest pageRequest = PageRequest.of(0, 10, Sort.by("name"));
		Page<ProductDTO> result = service.findAllPaged(pageRequest);
		
		Assertions.assertFalse(result.isEmpty()); // testa se page não é vazio
		Assertions.assertEquals("Macbook Pro", result.getContent().get(0).getName());
		Assertions.assertEquals("PC Gamer", result.getContent().get(1).getName());
		Assertions.assertEquals("PC Gamer Alfa", result.getContent().get(2).getName());
		
		//testando os primeiro 3 produtos
	}
}
