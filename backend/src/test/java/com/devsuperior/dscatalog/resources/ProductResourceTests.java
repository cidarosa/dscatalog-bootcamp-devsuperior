package com.devsuperior.dscatalog.resources;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.devsuperior.dscatalog.dto.ProductDTO;
import com.devsuperior.dscatalog.services.ProductService;
import com.devsuperior.dscatalog.services.exceptions.DataBaseException;
import com.devsuperior.dscatalog.services.exceptions.ResourceNotFoundException;
import com.devsuperior.dscatalog.tests.Factory;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(ProductResource.class)
public class ProductResourceTests {

	@Autowired
	private MockMvc mockMvc;

	// para converter para JSON o objeto java e enviar na requisição
	@Autowired
	private ObjectMapper objectMapper;

	private Long existingId;
	private Long nonExistingId;
	private Long dependentId;

	@MockBean // para mockar esse componente
	private ProductService service; // simula o comportamento do service

	private PageImpl<ProductDTO> page; // tipo concreto de Page, aceita new
	private ProductDTO productDTO;

	@BeforeEach
	void setUp() throws Exception {
		// simulando findAll(Pageable pageable)
		// exemplo página cocreta
		existingId = 1L;
		nonExistingId = 2L;
		dependentId=300L;

		productDTO = Factory.createProductDTO();
		page = new PageImpl<>(List.of(productDTO));

	//	when(service.findAllPaged(ArgumentMatchers.any())).thenReturn(page);

		when(service.findById(existingId)).thenReturn(productDTO);

		when(service.findById(nonExistingId)).thenThrow(ResourceNotFoundException.class);

		// qdo usa o any, não pode usar objetos simples, usa o eq()
		when(service.update(eq(existingId), any())).thenReturn(productDTO);
		when(service.update(eq(nonExistingId), any())).thenThrow(ResourceNotFoundException.class);
		
		
		//delete é void
		doNothing().when(service).delete(existingId);
		doThrow(ResourceNotFoundException.class).when(service).delete(nonExistingId);
		doThrow(DataBaseException.class).when(service).delete(dependentId);
		
		//exercícios
		when(service.insert(any())).thenReturn(productDTO);
	}

	// chamando o findAll - teste de unidade
	@Test
	public void findAllShouldReturnPage() throws Exception {
		// chamando uma requisição com o método get no caminho /products

		ResultActions result = mockMvc.perform(get("/products")
				.accept(MediaType.APPLICATION_JSON));
		// assertions
		result.andExpect(status().isOk());

		// forma abreviada
		// mockMvc.perform(get("/products")).andExpect(status().isOk());
	}

	@Test
	public void findByIdShouldReturnProductWhenIdExists() throws Exception {
		ResultActions result = mockMvc.perform(get("/products/{id}", existingId)
				.accept(MediaType.APPLICATION_JSON));
		// assertions
		result.andExpect(status().isOk());
		result.andExpect(jsonPath("$.id").exists());
		result.andExpect(jsonPath("$.name").exists());
		result.andExpect(jsonPath("$.description").exists());

	}

	@Test
	public void findByIdShouldReturnNotFoundWhenIdDoesNotExists() throws Exception {
		// NotFound código 404
		ResultActions result = mockMvc.perform(get("/products/{id}", nonExistingId)
				.accept(MediaType.APPLICATION_JSON));
		// assertions
		result.andExpect(status().isNotFound());
	}
	
	

	@Test
	public void updateShouldReturnProductDTOWhenIdExistis() throws Exception {
		// precisa passar o corpo da requisição
		// converter para JSON, faz a declaração do objectMapper,
		String jsonBody = objectMapper.writeValueAsString(productDTO);

		ResultActions result = mockMvc.perform(put("/products/{id}", existingId)
				.content(jsonBody)
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON));
		// assertions
		result.andExpect(status().isOk());
		result.andExpect(jsonPath("$.id").exists());
		result.andExpect(jsonPath("$.name").exists());
		result.andExpect(jsonPath("$.description").exists());
	}

	@Test
	public void updateShouldReturnNotFoundWhenIdDoesNotExistis() throws Exception {
		// precisa passar o corpo da requisição
		// converter para JSON, faz a declaração do objectMapper,
		String jsonBody = objectMapper.writeValueAsString(productDTO);

		ResultActions result = mockMvc.perform(put("/products/{id}", nonExistingId)
				.content(jsonBody)
				.contentType(MediaType.APPLICATION_JSON)
				.accept(MediaType.APPLICATION_JSON));
		// assertions
		result.andExpect(status().isNotFound());
	}
	
	@Test
	public void insertShouldReturnProductDTOCreated() throws Exception{
		
		String jsonBody = objectMapper.writeValueAsString(productDTO);
		
		ResultActions result =
				mockMvc.perform(post("/products")
						.content(jsonBody)
						.contentType(MediaType.APPLICATION_JSON)
						.accept(MediaType.APPLICATION_JSON)
						);
		
		result.andExpect(status().isCreated());
		result.andExpect(jsonPath("$.id").exists());
		result.andExpect(jsonPath("$.name").exists());
		result.andExpect(jsonPath("$.description").exists());
		
	}
	
	@Test
	public void deleteShouldReturnNoContentWhenIdExists() throws Exception {
		
		ResultActions result = mockMvc.perform(delete("/products/{id}", existingId)
				.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isNoContent());
		
	}
	
	@Test
	public void deleteShouldReturnNotFoundWhenIdDoesNotExists() throws Exception {
		
		ResultActions result = mockMvc.perform(delete("/products/{id}", nonExistingId)
				.accept(MediaType.APPLICATION_JSON));
		
		result.andExpect(status().isNotFound());		
	}
	
	  @Test public void deleteShouldReturnExceptionWhenViolationDatabase() throws Exception {
	  
		  ResultActions result = mockMvc.perform(delete("/products/{id}", dependentId)
			  .accept(MediaType.APPLICATION_JSON));
	  
	  result.andExpect(status().isBadRequest()); 
	  
	  }
	 
}
