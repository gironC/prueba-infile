create extension if not exists pgcrypto;
create schema auth;

create role infile_auth
login
password 'Contra123.';