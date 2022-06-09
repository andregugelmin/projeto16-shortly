CREATE TABLE users (
	"id" serial NOT NULL PRIMARY KEY,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT 'NOW()'
);

CREATE TABLE sessions (
	"id" serial NOT NULL PRIMARY KEY ,
	"token" TEXT NOT NULL UNIQUE,
	"userId" integer NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT 'NOW()'
);

CREATE TABLE urls (
	"id" serial NOT NULL PRIMARY KEY,
	"url" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT 'NOW()'
);

CREATE TABLE "shortUrls" (
	"id" serial NOT NULL PRIMARY KEY,
	"urlId" integer NOT NULL,
	"url" TEXT NOT NULL UNIQUE,
	"userId" integer NOT NULL,
	"visitsCount" integer NOT NULL DEFAULT '0',
	"createdAt" TIMESTAMP NOT NULL DEFAULT 'NOW()'
);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");


ALTER TABLE "shortUrls" ADD CONSTRAINT "shortUrls_fk0" FOREIGN KEY ("urlId") REFERENCES "urls"("id");
ALTER TABLE "shortUrls" ADD CONSTRAINT "shortUrls_fk1" FOREIGN KEY ("userId") REFERENCES "users"("id");