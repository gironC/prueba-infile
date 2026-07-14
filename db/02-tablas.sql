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

create table auth.noticia (
	id uuid default gen_random_uuid() primary key,
	titulo text not null,
	imagen text not null,
	descripcion text not null,
	fecha timestamptz default now() null
);

create table auth.categoria (
	id uuid default gen_random_uuid() primary key,
	nombre text not null
);

create table auth.categoria_noticia (
	id uuid default gen_random_uuid() primary key,
	noticia_id uuid not null,
	categoria_id uuid not null,

	constraint categoria_noticia_noticia_fkey foreign key (noticia_id)
	references auth.noticia(id) on update cascade on delete cascade,
	constraint categoria_noticia_categoria_fkey foreign key (categoria_id)
	references auth.categoria(id) on update cascade on delete cascade,
	constraint categoria_noticia_unique unique (noticia_id, categoria_id)
);

create table auth.favorito (
	id uuid default gen_random_uuid() primary key,
	usuario_id uuid not null,
	noticia_id uuid not null,
	creacion timestamptz default now() null,

	constraint favorito_usuario_fkey foreign key (usuario_id)
	references auth.usuario(id) on update cascade on delete cascade,
	constraint favorito_noticia_fkey foreign key (noticia_id)
	references auth.noticia(id) on update cascade on delete cascade,
	constraint favorito_unique unique (usuario_id, noticia_id)
);