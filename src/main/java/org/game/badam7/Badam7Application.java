package org.game.badam7;

import java.util.concurrent.TimeUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.CacheControl;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(scanBasePackages = "org.game")
@EnableWebMvc
@EnableScheduling
public class Badam7Application implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(Badam7Application.class, args);
	}

	/**
	 * Static Resource (CSS or JS) mapping
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// Register resource handler for CSS and JS
		registry.addResourceHandler("/app/**").addResourceLocations("classpath:/static/html/")
				.setCacheControl(CacheControl.maxAge(2, TimeUnit.HOURS).cachePublic());
		registry.addResourceHandler("/**").addResourceLocations("classpath:/static/")
				.setCacheControl(CacheControl.maxAge(2, TimeUnit.HOURS).cachePublic());

	}
}
