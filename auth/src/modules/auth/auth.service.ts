import type { FastifyRequest, FastifyReply } from "fastify";
import { pool } from '../../plugins/db.js';
import bcyrpt from 'bcrypt';
import {v4} from 'uuid';
import { env } from "../../config/env.js";
import {addDays, addMinutes} from 'date-fns';
import { resend, enviarCorreoActivacion, enviarCorreoReset } from "../../services/correo.services.js";
import { OAuth2Client } from "google-auth-library";

export async function registro(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { correo, password, nombres, apellidos } = req.body as any;
    if (!correo || !password || !nombres || !apellidos) {
      return reply.status(400).send({ error: 'Campos requeridos' });
    }
  
    const existe = await pool.query(`
      select id from auth.usuario where correo = $1`,
      [correo]
    );
    if (existe.rowCount! > 0) {
      return reply.status(400).send({ error: 'El correo ya está registrado' });
    }
  
    const hash = await bcyrpt.hash(password, 10);
    const res = await pool.query(`
      select * from auth.registro($1, $2, $3, $4)`,
      [correo, hash, nombres, apellidos]
    );

    const usuario = res.rows[0].registro;
    console.log(usuario.registro);
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const resCodigo = await pool.query(`
      select auth.crear_token($1, $2, $3)`,
      [usuario, codigo, addMinutes(new Date(), 30)]
    );

    await enviarCorreoActivacion(correo, codigo);
  
    return {
      usuario: usuario
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function registroGoogle(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { correo, password, nombres, apellidos } = req.body as any;
    if (!correo || !password || !nombres || !apellidos) {
      return reply.status(400).send({ error: 'Campos requeridos' });
    }
  
    const existe = await pool.query(`
      select id from auth.usuario where correo = $1`,
      [correo]
    );
    if (existe.rowCount! > 0) {
      return reply.status(400).send({ error: 'El correo ya está registrado' });
    }
  
    const hash = await bcyrpt.hash(password, 10);
    const res = await pool.query(`
      select * from auth.registro($1, $2, $3, $4)`,
      [correo, hash, nombres, apellidos]
    );

    const usuario = res.rows[0].registro;
    console.log(usuario.registro);

    const activa = await pool.query(`
      select * from auth.activar_usuario($1::uuid)`,
      [usuario.id]
    );
  
    return {
      usuario: usuario
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function activarUsuario(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const { codigo } = req.body as any;
    const verifica = await pool.query(`
      select * from auth.validar_token($1, $2)`,
      [req.user.sub, codigo]
    );
    console.log('res validar token', verifica.rows[0]);
    if (!verifica.rows[0].validar_token) {
      return reply.status(400).send({error: 'Codigo invalido'});
    }

    const activa = await pool.query(`
      select * from auth.activar_usuario($1::uuid)`,
      [req.user.sub]
    );

    return {
      activado: true
    };
  } catch(e) {
    return reply.status(500).send({error: e});
  }
}

export async function reenviarActivacion(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const usuario = req.user.sub;
    const correo = req.user.correo;
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const resCodigo = await pool.query(`
      select auth.crear_token($1, $2, $3)`,
      [usuario, codigo, addMinutes(new Date(), 30)]
    );

    await enviarCorreoActivacion(correo, codigo);

    return {
      enviado: true
    };
  } catch(e) {
    return reply.status(500).send({error: e});
  }
}

export async function enviarReset(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { correo } = req.body as any;

    const res = await pool.query(`select id, correo from auth.usuario where correo = $1`, [correo]);

    if(res.rows.length == 0) {
      return reply.status(400).send({error: 'Usuario no existe'});
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const resCodigo = await pool.query(`
      select auth.crear_token($1, $2, $3)`,
      [res.rows[0].id, codigo, addMinutes(new Date(), 30)]
    );

    await enviarCorreoReset(correo, codigo);

    return {
      enviado: true
    };
  } catch(e) {
    return reply.status(500).send({error: e});
  }
}

export async function activarReset(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { correo, codigo } = req.body as any;

    const res = await pool.query(`select id, correo from auth.usuario where correo = $1`, [correo]);

    const verifica = await pool.query(`
      select * from auth.validar_token($1, $2)`,
      [res.rows[0].id, codigo]
    );
    console.log('res validar token', verifica.rows[0]);
    if (!verifica.rows[0].validar_token) {
      return reply.status(400).send({error: 'Codigo invalido'});
    }

    const activa = await pool.query(`
      select * from auth.activar_usuario($1::uuid)`,
      [req.user.sub]
    );

    return {
      activado: true
    };
  } catch(e) {
    return reply.status(500).send({error: e});
  }
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { correo, password } = req.body as any;
    if (!correo || !password) {
      return reply.status(400).send({ error: 'Correo y contraseña son requeridos' });
    }
  
    const existe = await pool.query(`
      select id, correo, password_hash, nombres, apellidos, activo from auth.usuario
      where correo = $1`,
      [correo]
    );
    if (existe.rowCount! == 0) {
      return reply.status(400).send({ error: 'El correo no está registrado' });
    }
  
    const usuario = existe.rows[0];
    console.log(usuario);
    const valido = await bcyrpt.compare(password, usuario.password_hash);
  
    if (!valido) {
      return reply.status(400).send({ error: 'Contraseña incorrecta' });
    }
  
    const token = await reply.jwtSign({
      sub: usuario.id,
      correo: usuario.correo,
      role: 'authenticated'
    }, {expiresIn: env.ACCESS_TOKEN_EXPIRES});
  
    return {
      usuario: {
        access_token: token,
        id: usuario.id,
        correo: usuario.correo,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        activo: usuario.activo
      }
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function loginBiometrico(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { idUsr } = req.body as any;
  
    const existe = await pool.query(`
      select id, correo, password_hash, nombres, apellidos, activo from auth.usuario
      where id = $1`,
      [idUsr]
    );
    if (existe.rowCount! == 0) {
      return reply.status(400).send({ error: 'El correo no está registrado' });
    }
  
    const usuario = existe.rows[0];
  
    const token = await reply.jwtSign({
      sub: usuario.id,
      correo: usuario.correo,
      role: 'authenticated'
    }, {expiresIn: env.ACCESS_TOKEN_EXPIRES});
  
    return {
      usuario: {
        access_token: token,
        id: usuario.id,
        correo: usuario.correo,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        activo: usuario.activo
      }
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function loginGoogle(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { correo } = req.body as any;
  
    const existe = await pool.query(`
      select id, correo, password_hash, nombres, apellidos, activo from auth.usuario
      where correo = $1`,
      [correo]
    );
    if (existe.rowCount! == 0) {
      return reply.status(400).send({ error: 'El correo no está registrado' });
    }
  
    const usuario = existe.rows[0];
  
    const token = await reply.jwtSign({
      sub: usuario.id,
      correo: usuario.correo,
      role: 'authenticated'
    }, {expiresIn: env.ACCESS_TOKEN_EXPIRES});
  
    return {
      usuario: {
        access_token: token,
        id: usuario.id,
        correo: usuario.correo,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        activo: usuario.activo
      }
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { usuario, correo } = req.body as any;

    const token = await reply.jwtSign({
      sub: usuario,
      correo: correo,
      role: 'authenticated'
    }, {expiresIn: env.ACCESS_TOKEN_EXPIRES});
  
    return {
      access_token: token
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function perfil(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const res = await pool.query(`
      select id, correo, nombres, apellidos, telefono, activo from auth.usuario
      where id = $1`,
      [req.user.sub]
    );
    if (res.rowCount === 0) {
      return reply.status(404).send({ error: 'Usuario no encontrado' });
    }
  
    return {
      usuario: res.rows[0]
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function existeUsuario(req: FastifyRequest, reply: FastifyReply) {
  try {
    const {correo} = req.body as any;
    const res = await pool.query(`select correo from auth.usuario where correo = $1`, [correo]);
    if (res.rowCount == 0) {
      return reply.status(404).send({ error: 'Usuario no encontrado' });
    }
    return {
      correo: res.rows[0].correo
    };
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function actualizarUsuario(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const {nombres, apellidos, telefono} = req.body as any;
    const res = await pool.query(`
      select auth.editar_usuario($1, $2, $3, $4)
    `, [req.user.sub, nombres, apellidos, telefono]);
  
    const exito = res.rows[0].editar_usuario;
    if(!exito) {
      return reply.status(400).send({ error: 'No se pudo editar el usuario'});
    }
    return reply.send({
      success: true
    });
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}

export async function cambiarPass(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { correo, password } = req.body as any;

    const hash = await bcyrpt.hash(password, 10);
    
    const res = await pool.query(`
      select auth.reiniciar_contra($1, $2)
    `, [correo, hash]);
  
    console.log(res);
    const exito = res.rows[0].reiniciar_contra;
    if(!exito) {
      return reply.status(400).send({ error: 'No se pudo editar el usuario'});
    }
    return reply.send({
      success: true
    });
  } catch(e) {
    return reply.status(500).send({ error: e });
  }
}