package runtracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "runs")
public class Run {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private LocalDate date;
  private double lengthKm;
  private int timeMin;

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public LocalDate getDate() { return date; }
  public void setDate(LocalDate date) { this.date = date; }

  public double getLengthKm() { return lengthKm; }
  public void setLengthKm(double lengthKm) { this.lengthKm = lengthKm; }

  public int getTimeMin() { return timeMin; }
  public void setTimeMin(int timeMin) { this.timeMin = timeMin; }
}
