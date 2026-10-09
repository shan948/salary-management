package com.acme.salary.service;

import com.acme.salary.model.Employee;
import com.acme.salary.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class SeedDataService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedDataService.class);

    private final EmployeeRepository employeeRepository;

    @Value("${acme.salary.seed-on-startup:true}")
    private boolean seedOnStartup;

    @Value("${acme.salary.seed-count:10000}")
    private int seedCount;

    public SeedDataService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) {
        if (seedOnStartup && employeeRepository.count() == 0) {
            seedDatabase(seedCount);
        }
    }

    @Transactional
    public synchronized int seedDatabase(int targetCount) {
        long currentCount = employeeRepository.count();
        if (currentCount >= targetCount) {
            log.info("Database already seeded with {} records.", currentCount);
            return (int) currentCount;
        }

        log.info("Starting high-performance seed for {} employees...", targetCount);
        long startTime = System.currentTimeMillis();

        Random random = new Random(42); // deterministic seed for reproducibility

        List<CountryMeta> countries = List.of(
                new CountryMeta("United States", "USA", "USD", 1.00, List.of("San Francisco", "New York", "Austin", "Seattle", "Chicago")),
                new CountryMeta("United Kingdom", "GBR", "GBP", 1.30, List.of("London", "Manchester", "Edinburgh", "Bristol")),
                new CountryMeta("Germany", "DEU", "EUR", 1.08, List.of("Berlin", "Munich", "Frankfurt", "Hamburg")),
                new CountryMeta("India", "IND", "INR", 0.012, List.of("Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi")),
                new CountryMeta("Singapore", "SGP", "SGD", 0.76, List.of("Singapore")),
                new CountryMeta("Canada", "CAN", "CAD", 0.74, List.of("Toronto", "Vancouver", "Montreal", "Ottawa")),
                new CountryMeta("Australia", "AUS", "AUD", 0.67, List.of("Sydney", "Melbourne", "Brisbane")),
                new CountryMeta("Japan", "JPN", "JPY", 0.0068, List.of("Tokyo", "Osaka", "Kyoto")),
                new CountryMeta("Brazil", "BRA", "BRL", 0.18, List.of("Sao Paulo", "Rio de Janeiro", "Curitiba")),
                new CountryMeta("France", "FRA", "EUR", 1.08, List.of("Paris", "Lyon", "Toulouse"))
        );

        List<DeptMeta> departments = List.of(
                new DeptMeta("Engineering", 0.35, List.of("Software Engineer", "Backend Engineer", "Frontend Engineer", "DevOps Engineer", "QA Engineer", "Data Engineer", "Security Engineer")),
                new DeptMeta("Product", 0.12, List.of("Product Manager", "UX Designer", "Product Designer", "Technical Writer", "Design Lead")),
                new DeptMeta("Sales", 0.18, List.of("Account Executive", "Sales Development Rep", "Enterprise Sales Mgr", "Sales Director", "Solutions Architect")),
                new DeptMeta("Marketing", 0.10, List.of("Content Strategist", "Growth Marketer", "Brand Specialist", "SEO Specialist", "Marketing Director")),
                new DeptMeta("HR", 0.07, List.of("HR Generalist", "Technical Recruiter", "People Partner", "Total Rewards Specialist", "HR Director")),
                new DeptMeta("Finance", 0.08, List.of("Financial Analyst", "Accountant", "Finance Manager", "Controller", "Tax Specialist")),
                new DeptMeta("Operations", 0.06, List.of("Operations Specialist", "Facilities Manager", "Business Analyst", "Logistics Coordinator")),
                new DeptMeta("Legal", 0.04, List.of("Legal Counsel", "Compliance Analyst", "Contracts Specialist", "Privacy Counsel"))
        );

        List<LevelMeta> levels = List.of(
                new LevelMeta("L1 - Associate", 0.22, 60000, 75000, 90000, 10.0, 5000),
                new LevelMeta("L2 - Mid-Level", 0.34, 85000, 110000, 135000, 12.0, 12000),
                new LevelMeta("L3 - Senior", 0.26, 125000, 155000, 185000, 15.0, 25000),
                new LevelMeta("L4 - Staff", 0.10, 165000, 205000, 245000, 18.0, 45000),
                new LevelMeta("L5 - Principal", 0.05, 215000, 265000, 315000, 22.0, 75000),
                new LevelMeta("L6 - Director", 0.02, 275000, 340000, 410000, 28.0, 110000),
                new LevelMeta("L7 - VP", 0.01, 360000, 460000, 580000, 35.0, 180000)
        );

        String[] firstNames = {
                "Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Casey", "Riley", "Jamie", "Avery",
                "Liam", "Noah", "Oliver", "James", "Elijah", "William", "Henry", "Lucas", "Benjamin", "Theodore",
                "Olivia", "Emma", "Charlotte", "Amelia", "Sophia", "Isabella", "Ava", "Mia", "Evelyn", "Harper",
                "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
                "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Chiara", "Mateo", "Lucas", "Santiago", "Camila",
                "Kenji", "Ren", "Haruto", "Yuto", "Yui", "Hina", "Mei", "Sakura", "Lucas", "Leo", "Louis",
                "Gabriel", "Arthur", "Jules", "Maël", "Liam", "Noah", "Adam", "Paul", "Lukas", "Leon", "Finn"
        };

        String[] lastNames = {
                "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
                "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
                "Sharma", "Verma", "Patel", "Reddy", "Gupta", "Kumar", "Singh", "Shah", "Iyer", "Nair",
                "Tanaka", "Sato", "Suzuki", "Takahashi", "Watanabe", "Ito", "Nakamura", "Kobayashi", "Kato", "Yoshida",
                "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann",
                "Dubois", "Lambert", "Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Moreau"
        };

        String[] genders = {"MALE", "FEMALE", "NON_BINARY"};
        double[] genderWeights = {0.52, 0.44, 0.04};

        List<Employee> batch = new ArrayList<>(1000);
        int totalSaved = 0;

        for (int i = 1; i <= targetCount; i++) {
            String empId = String.format("EMP-%05d", i);
            String first = firstNames[random.nextInt(firstNames.length)];
            String last = lastNames[random.nextInt(lastNames.length)];
            String email = first.toLowerCase() + "." + last.toLowerCase() + i + "@acme.org";

            // Pick gender
            String gender = pickWeighted(genders, genderWeights, random);

            // Pick Country
            CountryMeta country = countries.get(random.nextInt(countries.size()));
            String city = country.cities().get(random.nextInt(country.cities().size()));

            // Pick Department
            DeptMeta dept = pickDepartment(departments, random);
            String jobTitle = dept.titles().get(random.nextInt(dept.titles().size()));

            // Pick Job Level
            LevelMeta level = pickLevel(levels, random);

            // Geographic compensation factor (US is baseline 1.0, Western Europe 0.88, India 0.45 localized purchasing parity)
            double geoFactor = switch (country.code()) {
                case "USA" -> 1.00;
                case "GBR" -> 0.90;
                case "DEU", "FRA" -> 0.88;
                case "CAN", "AUS" -> 0.85;
                case "SGP" -> 0.82;
                case "JPN" -> 0.78;
                case "BRA" -> 0.48;
                case "IND" -> 0.42;
                default -> 0.80;
            };

            // Department premium factor
            double deptPremium = switch (dept.name()) {
                case "Engineering" -> 1.15;
                case "Product" -> 1.10;
                case "Legal" -> 1.08;
                case "Sales" -> 1.05;
                case "Finance" -> 1.00;
                case "Marketing" -> 0.95;
                case "HR" -> 0.92;
                default -> 0.88;
            };

            double midUsd = level.midUsd() * geoFactor * deptPremium;
            double minUsd = midUsd * 0.80;
            double maxUsd = midUsd * 1.25;

            // Generate salary centered near midpoint with log-normal variance
            // Compa-ratio between 0.78 and 1.25, with standard distribution
            double compaVariation = 0.90 + (random.nextGaussian() * 0.08);
            // Cap to realistic outliers
            compaVariation = Math.max(0.74, Math.min(1.32, compaVariation));

            double baseSalaryUsdVal = midUsd * compaVariation;
            // Round to nearest 500
            baseSalaryUsdVal = Math.round(baseSalaryUsdVal / 500.0) * 500.0;

            BigDecimal baseUsd = BigDecimal.valueOf(baseSalaryUsdVal).setScale(2, RoundingMode.HALF_UP);
            BigDecimal baseLocal = baseUsd.divide(BigDecimal.valueOf(country.usdRate()), 2, RoundingMode.HALF_UP);

            // Bonus %: variation around level baseline
            double bonusPct = Math.max(5.0, level.baseBonusPct() + (random.nextInt(7) - 3));

            // Equity: based on level and seniority
            double equityVal = level.baseEquityUsd() * (0.8 + (random.nextDouble() * 0.4));
            BigDecimal equityUsd = BigDecimal.valueOf(Math.round(equityVal / 1000.0) * 1000.0).setScale(2, RoundingMode.HALF_UP);

            // Performance rating (1 to 5, skewed 3 and 4)
            int perfRating = switch (random.nextInt(10)) {
                case 0 -> 1;
                case 1 -> 2;
                case 2, 3, 4 -> 3;
                case 5, 6, 7 -> 4;
                default -> 5;
            };

            // Hire date in past 8 years
            int daysAgo = random.nextInt(365 * 8);
            LocalDate hireDate = LocalDate.now().minusDays(daysAgo);

            Employee emp = new Employee(
                    empId, first, last, email, gender, country.name(), country.code(), city,
                    dept.name(), jobTitle, level.name(), country.currency(),
                    baseLocal, baseUsd, bonusPct, equityUsd, perfRating,
                    BigDecimal.valueOf(minUsd).setScale(2, RoundingMode.HALF_UP),
                    BigDecimal.valueOf(midUsd).setScale(2, RoundingMode.HALF_UP),
                    BigDecimal.valueOf(maxUsd).setScale(2, RoundingMode.HALF_UP),
                    hireDate
            );

            batch.add(emp);

            if (batch.size() >= 1000) {
                employeeRepository.saveAll(batch);
                totalSaved += batch.size();
                batch.clear();
                log.info("Saved batch of employees: {} / {}", totalSaved, targetCount);
            }
        }

        if (!batch.isEmpty()) {
            employeeRepository.saveAll(batch);
            totalSaved += batch.size();
            batch.clear();
        }

        long elapsed = System.currentTimeMillis() - startTime;
        log.info("Successfully seeded {} employees in {} ms!", totalSaved, elapsed);
        return totalSaved;
    }

    private <T> T pickWeighted(T[] items, double[] weights, Random rand) {
        double r = rand.nextDouble();
        double cumulative = 0.0;
        for (int i = 0; i < items.length; i++) {
            cumulative += weights[i];
            if (r <= cumulative) {
                return items[i];
            }
        }
        return items[items.length - 1];
    }

    private DeptMeta pickDepartment(List<DeptMeta> depts, Random rand) {
        double r = rand.nextDouble();
        double cumulative = 0.0;
        for (DeptMeta d : depts) {
            cumulative += d.weight();
            if (r <= cumulative) {
                return d;
            }
        }
        return depts.get(depts.size() - 1);
    }

    private LevelMeta pickLevel(List<LevelMeta> levels, Random rand) {
        double r = rand.nextDouble();
        double cumulative = 0.0;
        for (LevelMeta l : levels) {
            cumulative += l.weight();
            if (r <= cumulative) {
                return l;
            }
        }
        return levels.get(levels.size() - 1);
    }

    private record CountryMeta(String name, String code, String currency, double usdRate, List<String> cities) {}
    private record DeptMeta(String name, double weight, List<String> titles) {}
    private record LevelMeta(String name, double weight, double minUsd, double midUsd, double maxUsd, double baseBonusPct, double baseEquityUsd) {}
}
