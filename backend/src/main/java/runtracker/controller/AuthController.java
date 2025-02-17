package runtracker.controller;

import runtracker.model.User;
import runtracker.model.AuthResponse;
import runtracker.service.UserService;
import runtracker.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final UserService userService;
  private final PasswordEncoder passwordEncoder;

  public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
  }

  // Sign-up endpoint (existing)
  @PostMapping("/signup")
  public ResponseEntity<?> signUp(@RequestBody User user) {
    if (userService.getUserByUsername(user.getUsername()) != null) {
      return ResponseEntity.badRequest().body("Username already exists");
    }
    userService.saveUser(user);
    return ResponseEntity.ok("User registered successfully");
  }

  // New login endpoint
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody User loginRequest) {
    User user = userService.getUserByUsername(loginRequest.getUsername());
    if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
    String token = JwtUtil.generateToken(user.getUsername());
    return ResponseEntity.ok(new AuthResponse(token));
  }
}
