package com.mandalink.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String renderDatabaseUrl;

    @Value("${spring.datasource.url}")
    private String fallbackUrl;

    @Value("${spring.datasource.username}")
    private String fallbackUsername;

    @Value("${spring.datasource.password}")
    private String fallbackPassword;

    @Bean
    public DataSource dataSource() {
        if (renderDatabaseUrl != null && renderDatabaseUrl.startsWith("postgres")) {
            URI uri = URI.create(renderDatabaseUrl);
            String[] userInfo = uri.getUserInfo().split(":", 2);
            String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath();

            return DataSourceBuilder.create()
                .url(jdbcUrl)
                .username(userInfo[0])
                .password(userInfo.length > 1 ? userInfo[1] : "")
                .driverClassName("org.postgresql.Driver")
                .build();
        }

        return DataSourceBuilder.create()
            .url(fallbackUrl)
            .username(fallbackUsername)
            .password(fallbackPassword)
            .build();
    }
}
