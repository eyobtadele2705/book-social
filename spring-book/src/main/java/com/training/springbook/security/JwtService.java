package com.training.springbook.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String SECRET;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    public String generateToken(Map<String,Object> claims, UserDetails userDetails){
//        Map<String,Object> claims=new HashMap<>();
        return createToken(claims,userDetails);
    }
//    public String generateToken(UserDetails userDetails){
//        Map<String,Object> claims=new HashMap<>();
//        return createToken(claims,userDetails);
//    }

    private String createToken(Map<String, Object> claims, UserDetails userDetails) {

        Map<String, Object> headers = new HashMap<>();

        headers.put("API-V", "1.0");
        headers.put("APP-V", "1.0");
        headers.put("Secret", "a80d0c68baeb28ead5bae1a86689e7e80653f46e0f6e757914114ebae9b72493cb2250ffc10c6c3ad17830774360993e3e3ecbc078a16e44eda781cbde8adbc1");
        headers.put("Developer", "Eyob");
        headers.put("AppName", "SpringBook");
        headers.put("Host", "localhost");
        headers.put("Port", "8088");
        var authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .claim("authorities", authorities)
                .setHeader(headers)
                .signWith(getSignKey(), SignatureAlgorithm.HS512).compact();
    }

    private Key getSignKey() {
        byte[] keyBytes= Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
