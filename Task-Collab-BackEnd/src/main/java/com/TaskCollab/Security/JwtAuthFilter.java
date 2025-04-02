package com.TaskCollab.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import com.TaskCollab.Service.UserService;
import com.TaskCollab.config.JwtUtils;

import java.io.IOException;

@Component 
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    // Constructor Injection
    public JwtAuthFilter(JwtUtils jwtUtils, UserService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Allow preflight requests to pass through
        if (request.getMethod().equals("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = parseJwt(request); // Extract token from Authorization header

            if (token != null && jwtUtils.validateToken(token)) {
                String username = jwtUtils.extractUsername(token);

                // Check if the user is already authenticated
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Create Authentication object and attach details
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("Authentication error", e); 
        }

        filterChain.doFilter(request, response); 
    }

    // Extract Bearer token from Authorization header
    private String parseJwt(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }
}
