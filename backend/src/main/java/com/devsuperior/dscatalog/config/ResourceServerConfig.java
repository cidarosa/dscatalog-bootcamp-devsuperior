package com.devsuperior.dscatalog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

	@Autowired
	private JwtTokenStore tokenStore;
	
	//configurar as rotas
	//GET
	private static final String[] PUBLIC = {"/oauth/token"}; //todos podem acessar
	
	//Rotas para operador ou admin
	private static final String[] OPERATOR_OR_ADMIN = {"/products/**", "/categories/**"};
	
	//Rotas somente para admin
	private static final String[] ADMIN = {"/users/**"};
	
	@Override
	public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
		resources.tokenStore(tokenStore);		
	}

	@Override
	public void configure(HttpSecurity http) throws Exception {
		//configurando quem pode acessar o que
		http.authorizeRequests()
		.antMatchers(PUBLIC).permitAll()
		.antMatchers(HttpMethod.GET, OPERATOR_OR_ADMIN).permitAll()
		.antMatchers(OPERATOR_OR_ADMIN).hasAnyRole("OPERATOR", "ADMIN") //tá no DB
		.antMatchers(ADMIN).hasRole("ADMIN")
		.anyRequest().authenticated(); //qq outra exige autenticação
	}
}
