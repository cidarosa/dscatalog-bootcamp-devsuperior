package com.devsuperior.dscatalog.services;

import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.dscatalog.dto.CategoryDTO;
import com.devsuperior.dscatalog.dto.ProductDTO;
import com.devsuperior.dscatalog.entities.Category;
import com.devsuperior.dscatalog.entities.Product;
import com.devsuperior.dscatalog.repositories.CategoryRepository;
import com.devsuperior.dscatalog.repositories.ProductRepository;
import com.devsuperior.dscatalog.services.exceptions.DataBaseException;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class ProductService {

	// dependency
	@Autowired
	private ProductRepository repository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public Page<ProductDTO> findAllPaged(PageRequest pageRequest) {
		Page<Product> list = repository.findAll(pageRequest);
		// construtor que recebe a entity, então não vem a category
		return list.map(x -> new ProductDTO(x));
	}

	// substituido para fazer paginação
	/*
	 * @Transactional(readOnly = true) public List<ProductDTO> findAll() {
	 * List<Product> list = repository.findAll();
	 * 
	 * return list.stream().map(x -> new
	 * ProductDTO(x)).collect(Collectors.toList());
	 * 
	 * 
	 * List<ProductDTO> listDto1 = new ArrayList<>(); for (Product cat : list) {
	 * listDto1.add(new ProductDTO(cat)); }
	 * 
	 * return listDto;
	 * 
	 * 
	 * }
	 */

	@Transactional(readOnly = true)
	public ProductDTO findById(Long id) {

		Optional<Product> obj = repository.findById(id);
		// Product entity = obj.get();
		Product entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		return new ProductDTO(entity, entity.getCategories()); // trazer as categorias - sobrecarga do construtor
	}

	@Transactional
	public ProductDTO insert(ProductDTO dto) {

		Product entity = new Product();
		// método auxiliar para não precisar copiar os mesmos dados no insert e update
		copyDtoToEntity(dto, entity);

		entity = repository.save(entity);

		return new ProductDTO(entity);
	}

	@Transactional
	public ProductDTO update(Long id, ProductDTO dto) {

		try {
			Product entity = repository.getOne(id);
			// método auxiliar para não precisar copiar os mesmos dados no insert e update
			copyDtoToEntity(dto, entity);

			entity = repository.save(entity);
			return new ProductDTO(entity);
		} catch (EntityNotFoundException e) {

			throw new ResourceNotFoundException("Id not found: " + id);
		}

	}

	public void delete(Long id) {

		try {
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("Id not found: " + id);
		} catch (DataIntegrityViolationException e) {
			throw new DataBaseException("Integrity veiolation");
		}

	}

	private void copyDtoToEntity(ProductDTO dto, Product entity) {

		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setPrice(dto.getPrice());
		entity.setImgUrl(dto.getImgUrl());
		entity.setDate(dto.getDate());

		// categorias
		entity.getCategories().clear();

		for (CategoryDTO catDto : dto.getCategories()) {
			// instanciar entidade Categoria pelo JPA com função GetOne = sem DB
			// precisa colocar dependência CategoryRepository
			Category category = categoryRepository.getOne(catDto.getId());
			entity.getCategories().add(category);
		}

	}

}
