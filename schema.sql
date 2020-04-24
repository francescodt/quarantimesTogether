DROP TABLE IF EXISTS stories;

CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  location VARCHAR(255),
  story TEXT,
  category VARCHAR(255)
);

INSERT INTO stories (name,location,story,category) VALUES('billy','texas','I cannot believe this corona thing at tall cuz i dont even drink that mexican beer no siree.','random');
