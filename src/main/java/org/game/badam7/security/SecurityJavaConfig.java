package org.game.badam7.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

@EnableGlobalMethodSecurity(prePostEnabled = true)
@Configuration
@EnableWebSecurity
public class SecurityJavaConfig extends WebSecurityConfigurerAdapter {
	
    @Autowired
    UserDetailsService userDetailsService;

	@Autowired
	private RestAuthenticationEntryPoint restAuthenticationEntryPoint;

	@Autowired
	private MySavedRequestAwareAuthenticationSuccessHandler mySuccessHandler;

	private SimpleUrlAuthenticationFailureHandler myFailureHandler = new SimpleUrlAuthenticationFailureHandler();

	@Override
	protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(getPasswordEncoder());
	}

    private PasswordEncoder getPasswordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return charSequence.toString();
            }
            
            @Override
            public boolean matches(CharSequence charSequence, String s) {
                return true;
            }
        };
    }
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().anonymous().disable().exceptionHandling()
				.authenticationEntryPoint(restAuthenticationEntryPoint).and().authorizeRequests()
				.antMatchers("/", "/login", "/static/**").permitAll().antMatchers("/api/**").authenticated()
				.antMatchers("/api/admin/**").hasRole("ADMIN").and().formLogin().successHandler(mySuccessHandler)
				.failureHandler(myFailureHandler).and().logout().logoutSuccessUrl("/app/login.html");
	}
}