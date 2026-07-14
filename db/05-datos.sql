-- INSERTS DE CATEGORÍAS, NOTICIAS Y RELACIONES

insert into auth.categoria (nombre)
values
  ('Tecnología'),
  ('Deportes'),
  ('Cultura'),
  ('Salud');

insert into auth.noticia (titulo, imagen, descripcion, fecha)
select
  format('Noticia %s: %s', i, case (i - 1) % 10
    when 0 then 'innovación digital'
    when 1 then 'avance tecnológico'
    when 2 then 'competencia deportiva'
    when 3 then 'evento cultural'
    when 4 then 'recomendación médica'
    when 5 then 'nueva tendencia'
    when 6 then 'impacto social'
    when 7 then 'descubrimiento local'
    when 8 then 'cambio en la comunidad'
    else 'actualización relevante'
  end),
  format('https://picsum.photos/id/%s/800/800', i),
  format(
    'Esta es la descripción detallada de la noticia %s, diseñada para mostrar un contenido más extenso y útil dentro de la aplicación. Incluye contexto, impacto, protagonistas y referencias relevantes que ayudan a dar mayor profundidad a cada publicación y a enriquecer la experiencia del usuario.',
    i
  ),
  now() - (i - 1) * interval '1 day'
from generate_series(1, 50) as g(i);

insert into auth.categoria_noticia (noticia_id, categoria_id)
select
  n.id,
  c.id
from (
  select
    id,
    row_number() over (order by id) as rn
  from auth.noticia
) n
join auth.categoria c
  on c.nombre = case (n.rn - 1) % 4
    when 0 then 'Tecnología'
    when 1 then 'Deportes'
    when 2 then 'Cultura'
    else 'Salud'
  end
on conflict (noticia_id, categoria_id) do nothing;
