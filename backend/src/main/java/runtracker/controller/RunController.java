package runtracker.controller;

import runtracker.model.Run;
import runtracker.repository.RunRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/runs")
@PreAuthorize("isAuthenticated()") // Ensures only authenticated users can access these endpoints
public class RunController {
  private final RunRepository runRepository;

  public RunController(RunRepository runRepository) {
    this.runRepository = runRepository;
  }

  @GetMapping
  public List<Run> getAllRuns() {
    return runRepository.findAll();
  }

  @PostMapping
  public Run createRun(@RequestBody Run run) {
    return runRepository.save(run);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Run> getRunById(@PathVariable Long id) {
    return runRepository.findById(id)
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
  }
}
