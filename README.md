## Starting schema

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO students (name)
SELECT
  'Student ' || n AS name
FROM generate_series(1, 100000) AS s(n);

INSERT INTO enrollments (student_id, year)
SELECT
  id AS student_id,
  (FLOOR(RANDOM() * (2025 - 1990 + 1)) + 1990)::INTEGER AS year
FROM
  students;
```

## Query performance

```sql
SELECT
  enrollments.year,
  COUNT(*)
FROM enrollments
  JOIN students ON enrollments.student_id = students.id
GROUP BY enrollments.year
ORDER BY enrollments.year;
```

Average execution duration over 5 queries: 36.4774

## Denormalization

```sql
ALTER TABLE enrollments
  ADD COLUMN student_name TEXT;

UPDATE enrollments e
  SET student_name = s.name
FROM students s
WHERE e.student_id = s.id;
```

## Query and performance after denormalization

```sql
SELECT
  year,
  COUNT(*)
FROM enrollments
GROUP BY year
ORDER BY year;
```

Average execution duration over 5 queries: 9.323
