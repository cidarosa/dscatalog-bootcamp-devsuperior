package com.devsuperior.dscatalog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devsuperior.dscatalog.entities.User;

public interface UserRepository extends JpaRepository<User, Long>{
	
	//criando um método para verificar se já existe no DB
	User findByEmail(String email);

}
