package com.school.sgai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration des services IA (Flask APIs)
 * 
 * @author Équipe SGAI
 */
@Configuration
@ConfigurationProperties(prefix = "ai.service")
public class AiServiceConfig {
    
    private int timeout = 10000; // 10 secondes par défaut
    private int connectionTimeout = 5000; // 5 secondes
    private int maxRetries = 3;
    private int retryDelay = 1000; // 1 seconde
    
    /**
     * RestTemplate configuré pour les appels aux services IA
     */
    @Bean
    public RestTemplate aiRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectionTimeout);
        factory.setReadTimeout(timeout);
        
        return new RestTemplate(factory);
    }
    
    // Getters et Setters
    public int getTimeout() {
        return timeout;
    }
    
    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }
    
    public int getConnectionTimeout() {
        return connectionTimeout;
    }
    
    public void setConnectionTimeout(int connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }
    
    public int getMaxRetries() {
        return maxRetries;
    }
    
    public void setMaxRetries(int maxRetries) {
        this.maxRetries = maxRetries;
    }
    
    public int getRetryDelay() {
        return retryDelay;
    }
    
    public void setRetryDelay(int retryDelay) {
        this.retryDelay = retryDelay;
    }
}
