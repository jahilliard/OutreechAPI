CREATE TABLE profiles(
   ID SERIAL PRIMARY KEY     NOT NULL,
   email           CHAR(100)    NOT NULL,
   password           CHAR(100)     NOT NULL
);

CREATE TABLE prefSymbs(
   ID SERIAL PRIMARY KEY     NOT NULL,
   profID      INT references profiles(ID) NOT NULL,
   symbol           CHAR(100)    NOT NULL,
   prefix           CHAR(1)     NOT NULL
);


CREATE TABLE reeches(
   ID SERIAL PRIMARY KEY     NOT NULL,
   url      TEXT NOT NULL, 
   hashtag varchar(100) NOT NULL,
   atSymb varchar(100) NOT NULL, 
   score INT NOT NULL,
   totalVotes INT NOT NULL,
   Latitude REAL,
   Longitude REAL
);

INSERT INTO profiles (email, password) VALUES ('justin.a.hilliard@gmail.com', 'password');

CREATE TABLE reechBelongs(
   ID SERIAL PRIMARY KEY     NOT NULL,
   profID      INT references profiles(ID) NOT NULL,
   reechID      INT references reeches(ID) NOT NULL,
   isOwner Boolean NOT NULL
);


DROP TABLE reechBelongs;
DROP TABLE reeches;
DROP TABLE prefSymbs;
DROP TABLE profiles;