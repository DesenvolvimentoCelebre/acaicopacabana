const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const pool = require('../database/connection/cxx');
const license = require('../system/verificarion');


const jwtSecret = "token";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    done(null, payload);
  })
);

router.post('/estoque', (req, res) => {
    const query = `INSERT INTO estoque (nome, categoria, data_compra, data_validade, quantidade, valor_compra) VALUES (?, ?, ?, ? ,?, ?)`;
    const { nome, categoria, data_compra, data_validade, quantidade, valor_compra } = req.body;
    const values = [nome, categoria, data_compra, data_validade, quantidade, valor_compra];

    pool.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ success: false, error: ['Erro ao inserir produto no estoque']})
            return;
        }

        console.log(results);
        res.status(200).json({ success: true, data: [' Produto inserido com sucesso ']})
    });
});

router.get('/estoque', (req, res) => {
  
  function verifyLicense(licenseString) {
    const [token, expirationDateString] = licenseString.split('|');
    const expirationDate = parseISO(expirationDateString);
    
    if (expirationDate < new Date()) {
      return false;
    }
    return true;
  }
  const license = "8cd5b89e018bce4831e380057886246fe105ed2efdf691a835b93cffdb844571|2024-02-26T23:19:37.602Z";
  
  if (!verifyLicense(license)) {
    return res.status(401).json({ success: false, error: ['Licença expirada, por favor contate o administrador'] });
  }
  // Se a licença for válida, continue com a rota

  const query = `SELECT * FROM estoque`;

  pool.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, error: ['Por favor contatar o administrador', err] });
      return;
    } else if (results.length === 0) {
      res.status(404).json({ success: true, message: ['Você não possui itens no estoque'] });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

router.post('/produto', (req, res) => {
  const {nome,categoria,codigo_produto,codigo_personalizado,preco_custo,tipo,quantidade,data_venda,img_produto} = req.body;
  const values =[nome,categoria,codigo_produto,codigo_personalizado,preco_custo,tipo,quantidade,data_venda,img_produto];
  const query = `INSERT INTO produto (nome,categoria,codigo_produto,codigo_personalizado,preco_custo,tipo,quantidade,data_venda,img_produto) VALUES (?,?,?,?,?,?,?,?,?)`;

  pool.query(query, values, (err, results) => {
    if (err) {
      res.status(400).json({ success: false, error: ['Erro ao cadastrar produto']})
    } else {
      res.status(201).json({ success: true, message:['Produto cadastrado com sucesso']})
    }
  });
});

router.get('/produto', (req, res) => {
  const query = 'SELECT * FROM produto';

  pool.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, error: ['Por favor contatar o suporte']});
    } else if (results.length === 0) {
      res.status(404).json({ success: true, message: ['Não existe produtos cadastrados']});
    } else {
      res.status(200).json({ success: true, data: results})
    }
  })
})

router.post('/user', async (req, res) => {
    const { nome, usuario, senha, cargo } = req.body;
    const hashedsenha = await bcrypt.hash(senha, 10);

    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, error: ['Erro ao cadastrar usuário'] });
            return;
        }

        const query = `INSERT INTO usuario (nome, usuario, senha, cargo) VALUES (?, ?, ?, ?)`;
        const values = [nome, usuario, hashedsenha, cargo];

        pool.query(query, values, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ success: false, error: ['Erro ao cadastrar usuário'] });
                return;
            }

            res.status(201).json({ success: true, data: ['Usuário cadastrado com sucesso'] });
        });
    });
});

router.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  const query = "SELECT * FROM usuario WHERE usuario = ?";


  pool.query(query, [usuario], async (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ success: false, errors: ["Erro no Banco de Dados"] });
    } else if (results.length === 1) {
      const user = results[0];

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (isPasswordValid) {
        const payload = { id: user.id, usuario: user.usuario };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
        res.json({ success: true, token: token });
      } else {
        res
          .status(401)
          .json({ success: false, errors: ["Falha na Autenticação"] });
      }
    } else {
      res
        .status(401)
        .json({ success: false, errors: ["Usuário não encontrado"] });
    }
  });
});

module.exports = router;
