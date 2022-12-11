-- USE CORRECT DATABASE
\c assembly_ai;

-- DROP ALL TABLES IF THEY EXIST
DROP TABLE IF EXISTS captions;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS organizations;

-- CREATE TABLES
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    full_captions TEXT,
    filename TEXT NOT NULL,
    task_id TEXT, 
    FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE captions (
    id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (video_id) REFERENCES videos (id)
);