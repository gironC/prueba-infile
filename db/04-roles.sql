revoke all on schema auth from public;
revoke all on schema public from public;

grant connect on database infile to infile_auth;
grant usage on schema auth to infile_auth;
grant select, insert, update, delete on all tables in schema auth to infile_auth;
grant execute on all functions in schema auth to infile_auth;