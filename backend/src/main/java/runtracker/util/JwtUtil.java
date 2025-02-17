package runtracker.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
  // In production, store the key securely (for example, in an environment variable)
  private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
  private static final long EXPIRATION_TIME = 86400000; // 24 hours

  public static String generateToken(String username) {
    return Jwts.builder()
               .setSubject(username)
               .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
               .signWith(key)
               .compact();
  }

  public static String validateTokenAndGetUsername(String token) {
    return Jwts.parserBuilder()
               .setSigningKey(key)
               .build()
               .parseClaimsJws(token)
               .getBody()
               .getSubject();
  }
}
