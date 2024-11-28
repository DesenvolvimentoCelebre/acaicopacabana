const  pool = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()

const jwtSecret = process.env.secret

async function loginUser(usuario, senha) {
  try {
    const query = `
      SELECT 
        id, 
        UPPER(nome) AS nome, 
        usuario, 
        senha, 
        UPPER(cargo) AS cargo, 
        adm
      FROM usuario
      WHERE usuario = ?
    `;
    const values = [usuario]
    const [results] = await pool.query(query, values);
    
    if (results.length === 1) {
      const user = results[0];
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      
      if (isPasswordValid) {
        const payload = { id: user.id, usuario: user.usuario };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
        const decodedToken = jwt.decode(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        return { 
          success: true,
          token: token,
          expiration: expirationDate,
          nome: user.nome,
          cargo: user.cargo,
          adm: user.adm,
          id: user.id
        };
      } else {
        return { success: false, errors: ["Senha incorreta"] };
      }
    } else {
      return { success: false, errors: ["Usuário não encontrado"] };
    }
  } catch (error) {
    return { success: false, errors: ["Erro no Banco de Dados"], details: error };
  }
}

async function authlib(senha, pedido, operador_liberacao) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query('SELECT senha FROM usuario');
    if (rows.length === 0) {
      await connection.rollback();
      connection.release();
      return { success: false, message: "Autenticação falhou. Usuário não é administrador ou senha incorreta." };
    }

    const hashedPassword = rows[0].senha;
    const passwordMatch = await bcrypt.compare(senha, hashedPassword);
    
    if (!passwordMatch) {
      await connection.rollback();
      connection.release();
      return { success: false, message: "Autenticação falhou. Usuário não é administrador ou senha incorreta." };
    }

    const logSql = 'INSERT INTO log_lib (pedido, operador_liberacao) VALUES (?, ?)';
    await connection.query(logSql, [pedido, operador_liberacao]);

    await connection.commit();
    connection.release();
    return { success: true, message: "Liberado inserção manual" };
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    return { success: false, error: "Erro ao liberar inserção manual", details: error.message };
  }
}

module.exports = {
  loginUser,
  authlib
};
