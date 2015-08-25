package by.intexsoft.projectmanager.config;

import static org.hibernate.cfg.AvailableSettings.HBM2DDL_AUTO;

import java.net.*;
import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.context.annotation.*;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;
import org.springframework.orm.jpa.*;
import org.springframework.orm.jpa.vendor.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableJpaRepositories(basePackages="by.intexsoft.projectmanager.dao", entityManagerFactoryRef = "entityManagerFactory")
@ComponentScan(basePackages = "by.intexsoft.projectmanager", excludeFilters = {
		@ComponentScan.Filter(value = Controller.class, type = FilterType.ANNOTATION),
		@ComponentScan.Filter(value = Configuration.class, type = FilterType.ANNOTATION)
})

public class AppConfig extends RepositoryRestMvcConfiguration {

	@Override
	protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		super.configureRepositoryRestConfiguration(config);
		try {
			config.setBaseUri(new URI("/api"));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
	}


	@Bean
	  public DataSource dataSource(){
		return new SimpleDriverDataSource() {{
	        setDriverClass(com.mysql.jdbc.Driver.class);
	        setUsername("root");
	        setUrl("jdbc:mysql://localhost:3306/projectmanager");
	        setPassword("m8808921");
	    }};
	  }

	  @Bean
	  public JpaVendorAdapter jpaVendorAdapter() {
	    HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
	    adapter.setShowSql(true);
	    adapter.setGenerateDdl(true);
	    adapter.setDatabase(Database.MYSQL);
	    return adapter;
	  }

	  @Bean
	    public LocalContainerEntityManagerFactoryBean entityManagerFactory() throws ClassNotFoundException {
	    HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
	    vendorAdapter.setGenerateDdl(Boolean.TRUE);
	    vendorAdapter.setShowSql(Boolean.TRUE);
	    
		LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
	    factoryBean.setDataSource(dataSource());
	    factoryBean.setPackagesToScan("by.intexsoft.projectmanager.domain");
	    factoryBean.setJpaVendorAdapter(vendorAdapter);
	    factoryBean.afterPropertiesSet();
	    factoryBean.setJpaProperties(jpaProperties());

	    return factoryBean;
	  }

	@Bean
	public JpaTransactionManager transactionManager() throws ClassNotFoundException {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(entityManagerFactory().getObject());

		return transactionManager;
	}

	@Bean
	  public Properties jpaProperties() {
	    Properties properties = new Properties();
	    properties.put(HBM2DDL_AUTO, "create-drop");
	    return properties;
	  }
}
