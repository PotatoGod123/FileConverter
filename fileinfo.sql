DROP TABLE IF EXISTS conversiondata;

CREATE TABLE conversiondata(
  id SERIAL PRIMARY KEY,
  filetype VARCHAR(255),
  filesize TEXT
);