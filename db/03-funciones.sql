-------------------------FUNCIONES GENERALES (APLICA PARA EL RESTO DE SAAS)-------------------------

-- FUNCIONES AUTH

create or replace function auth.registro(v_correo text, v_pass text, v_nombres text, v_apellidos text)
returns uuid
language sql
as $$
  insert into auth.usuario(correo, password_hash, nombres, apellidos)
  values(v_correo, v_pass, v_nombres, v_apellidos)
  returning auth.usuario.id;
$$;

create or replace function auth.editar_usuario(v_id uuid, v_nombres text, v_apellidos text)
returns boolean
language sql
as $$
  with actualiza as(
    update auth.usuario
    set nombres = v_nombres,
    apellidos = v_apellidos
    where id = v_id
    returning 1
  )
  select exists(select 1 from actualiza);
$$;

create or replace function auth.crear_token(v_usuario_id uuid, v_valor text, v_expiracion timestamptz)
returns uuid
language sql
as $$
  update auth.reset_token
  set usado = true
  where usuario_id = v_usuario_id;
  insert into auth.reset_token(usuario_id, valor, expiracion)
  values(v_usuario_id, v_valor, v_expiracion)
  returning auth.reset_token.id;
$$;

create or replace function auth.activar_usuario(v_usuario_id uuid)
returns boolean
language plpgsql
as $$
begin
  update auth.usuario
  set activo = true
  where id = v_usuario_id;
  return true;
end;
$$;

create or replace function auth.validar_token(v_usuario_id uuid, v_codigo text)
returns boolean
language plpgsql
as $$
begin
  if not exists (
    select 1 from auth.reset_token where usuario_id = v_usuario_id
    and valor = v_codigo
    and expiracion >= now()
    and usado = false
  ) then
    return false;
  end if;
  update auth.reset_token
  set usado = true
  where usuario_id = v_usuario_id;
  return true;
end;
$$;

create or replace function auth.reiniciar_contra(v_correo text, v_contra text)
returns boolean
language plpgsql
as $$
begin
  update auth.usuario
  set password_hash = v_contra
  where correo = v_correo;
  return true;
end;
$$;

create or replace function auth.obtener_noticias(v_usuario_id uuid, v_pagina integer, v_categoria_id uuid default null)
returns table (
  id uuid,
  titulo text,
  imagen text,
  descripcion text,
  fecha timestamptz,
  es_favorito boolean,
  categorias text[]
)
language sql
as $$
  select n.id, n.titulo, n.imagen, n.descripcion, n.fecha,
    exists (
      select 1
      from auth.favorito f
      where f.usuario_id = v_usuario_id
        and f.noticia_id = n.id
    ) as es_favorito,
    coalesce(
      (
        select array_agg(c.nombre order by c.nombre)
        from auth.categoria_noticia cn
        join auth.categoria c on c.id = cn.categoria_id
        where cn.noticia_id = n.id
      ),
      array[]::text[]
    ) as categorias
  from auth.noticia n
  where
    v_categoria_id is null
    or exists (
      select 1
      from auth.categoria_noticia cn
      where cn.noticia_id = n.id
        and cn.categoria_id = v_categoria_id
    )
  order by n.fecha desc, n.id
  limit 10
  offset greatest((coalesce(v_pagina, 1) - 1) * 10, 0);
$$;

create or replace function auth.obtener_noticia(v_noticia_id uuid)
returns table (
  id uuid,
  titulo text,
  imagen text,
  descripcion text,
  fecha timestamptz,
  categorias text[]
)
language sql
as $$
  select n.id, n.titulo, n.imagen, n.descripcion, n.fecha,
    coalesce(
      (
        select array_agg(c.nombre order by c.nombre)
        from auth.categoria_noticia cn
        join auth.categoria c on c.id = cn.categoria_id
        where cn.noticia_id = n.id
      ),
      array[]::text[]
    ) as categorias
  from auth.noticia n
  where n.id = v_noticia_id;
$$;

create or replace function auth.marcar_favorito(v_usuario_id uuid, v_noticia_id uuid, v_favorito boolean)
returns boolean
language plpgsql
as $$
begin
  if v_favorito then
    insert into auth.favorito (usuario_id, noticia_id)
    values (v_usuario_id, v_noticia_id)
    on conflict (usuario_id, noticia_id) do nothing;
  else
    delete from auth.favorito
    where usuario_id = v_usuario_id
      and noticia_id = v_noticia_id;
  end if;

  return true;
end;
$$;

create or replace function auth.obtener_favoritos(v_usuario_id uuid, v_pagina integer)
returns table (
  id uuid,
  titulo text,
  imagen text,
  descripcion text,
  fecha timestamptz,
  es_favorito boolean,
  categorias text[]
)
language sql
as $$
  select
    n.id,
    n.titulo,
    n.imagen,
    n.descripcion,
    n.fecha,
    true as es_favorito,
    coalesce(
      (
        select array_agg(c.nombre order by c.nombre)
        from auth.categoria_noticia cn
        join auth.categoria c on c.id = cn.categoria_id
        where cn.noticia_id = n.id
      ),
      array[]::text[]
    ) as categorias
  from auth.noticia n
  join auth.favorito f on f.noticia_id = n.id
  where f.usuario_id = v_usuario_id
  order by n.fecha desc, n.id
  limit 10
  offset greatest((coalesce(v_pagina, 1) - 1) * 10, 0);
$$;

