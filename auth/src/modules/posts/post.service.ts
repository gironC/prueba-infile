import type { FastifyRequest, FastifyReply } from "fastify";
import { pool } from '../../plugins/db.js';
import { env } from "../../config/env.js";

export async function categorias(req: FastifyRequest, reply: FastifyReply) {
  try {
    const res = await pool.query(`select id, nombre from auth.categoria`,
      []
    );
    console.log(res);
    return {
      lista: res.rows
    };
  } catch(e) {
    console.log(e);
    return reply.status(500).send({ error: e });
  }
}

export async function posts(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const { pagina, categoria } = req.body as any;
    const res = await pool.query(`select * from auth.obtener_noticias($1, $2, $3)`,
      [req.user.sub, pagina, categoria]
    );
    return {
      lista: res.rows
    };
  } catch(e) {
    console.log(e);
    return reply.status(500).send({ error: e });
  }
}

export async function favoritos(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const { pagina } = req.body as any;
    const res = await pool.query(`select * from auth.obtener_favoritos($1, $2)`,
      [req.user.sub, pagina]
    );
    return {
      lista: res.rows
    };
  } catch(e) {
    console.log(e);
    return reply.status(500).send({ error: e });
  }
}

export async function relacionados(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const { id } = req.body as any;
    const res = await pool.query(
      `select n.id, n.titulo, n.imagen from auth.noticia n
      join auth.categoria_noticia cn on cn.noticia_id = n.id
      join auth.categoria c on cn.categoria_id = c.id
      where n.id != $1
      and c.id in (
        select c.id from auth.categoria c
        join auth.categoria_noticia cn on cn.categoria_id = c.id
        where cn.noticia_id = $1
      )
      limit 3`,
      [id]
    );

    return {
      lista: res.rows
    };
  } catch(e) {
    console.log(e);
    return reply.status(500).send({ error: e });
  }
}

export async function post(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const { id } = req.body as any;
    const res = await pool.query(`select * from auth.obtener_noticia($1)`,
      [id]
    );
    return {
      noticia: res.rows[0]
    };
  } catch(e) {
    console.log(e);
    return reply.status(500).send({ error: e });
  }
}

export async function arFavoritos(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const { noticia, estado } = req.body as any;
    const res = await pool.query(`select * from auth.marcar_favorito($1::uuid, $2::uuid, $3::bool)`,
      [req.user.sub, noticia, estado]
    );
    return {
      marcado: res.rows[0].marcar_favorito
    };
  } catch(e) {
    console.log(e);
    return reply.status(500).send({ error: e });
  }
}