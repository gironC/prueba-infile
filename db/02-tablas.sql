-- INICIO ESTRUCTURA GENERAL
-- TABLAS AUTH
create table auth.usuario (
	id uuid default gen_random_uuid() primary key,
	correo text not null,
	password_hash text not null,
	nombres text not null,
	apellidos text not null,
  activo boolean default false not null,
	creacion timestamptz default now() null
);

create table auth.reset_token (
  id uuid default gen_random_uuid() primary key,
	usuario_id uuid not null,
	valor text not null,
  usado boolean default false not null,
	expiracion timestamptz not null,
	creacion timestamptz default now() null,

  constraint refresh_token_user_fkey foreign key (usuario_id)
  references auth.usuario(id) on update cascade on delete cascade
);