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