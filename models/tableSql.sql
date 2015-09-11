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

INSERT INTO reechBelongs (profID, reechID, isOwner) VALUES (1, 1, false);
INSERT INTO profiles (email, password) VALUES ('justin.a.hilliard@gmail.com', 'password');
INSERT INTO reeches (url, hashtag, atSymb, score, totalVotes, Longitude, Latitude) VALUES 
('reechImg/AlphaBoston.jpg', 'alphaPhi', 'Boston', 10, 15, -118.44, 34.06) Returning Id;
select profiles.id, profiles.email, reeches.Id, reeches.url from profiles inner join 
   reechBelongs on profiles.Id = reechBelongs.profId inner join reeches on reeches.Id = reechBelongs.reechId;

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