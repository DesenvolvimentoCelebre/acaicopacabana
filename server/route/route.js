const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const pool = require('../database/connection/cxx');
// const license = require('../system/verificarion');
//Teste rota de up 
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs').promises;


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

router.get('/user', passport.authenticate("jwt", { session: false }), (req, res) => {
  const user = req.user;
  const usuario = user.usuario;

  const query = 'select * from usuario where usuario = ?';

  pool.query(query, usuario, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, error: ['Erro ao buscar usuário, contate o administrador', err]})
    } else if (results.length === 1) {
      const dados = results[0];
      res.status(404).json({ success: true, user: dados })
    } else {
      res.status(404).json({ success: false, error:['Nenhum usuário encontrado']})
    }
  })
})

router.get('/estoque', (req, res) => {
  const query = `select nome,categoria,codigo_produto,codigo_personalizado,preco_custo,tipo,SUM(quantidade) as quantidade,data_venda,img_produto
from produto
group by nome;`;

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

router.get('/nped', async (req, res) => {
  const query = 'SELECT MAX(pedido) + 1 as proximoNumero FROM pedidos ';

    pool.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ success: false, error: ['Erro ao buscar número do pedido']})
      } else {
        res.status(200).json({ success: true, message: results})
      }
    })
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
  const query = 'SELECT * FROM estoque';

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
        const decodedToken = jwt.decode(token);
        const expirationDate = new Date(decodedToken.exp * 1000); 
        res.json({ success: true, token: token, expiration: expirationDate });
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

router.post('/ped', (req, res) => {
  if (!req.body || !req.body.pedido || !req.body.pedido.produtos) {
    return res.status(400).send('Formato de pedido inválido');
  }

  const pedido = req.body.pedido;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Erro ao obter conexão do pool:', err);
      return res.status(500).send('Erro ao obter conexão do pool');
    } 

    connection.beginTransaction(err => {
      if (err) {
        console.error('Erro ao iniciar transação:', err);
        pool.release();
        return res.status(500).send('Erro ao iniciar transação');
      }

      pedido.produtos.forEach(produto => {
        const sql = 'INSERT INTO pedno (pedido, prodno, valor_unit, unino, data_fechamento, sta, userno) VALUES (?,?, ?, ?, CURRENT_TIMESTAMP, ?, ?)';
        const values = [produto.pedido, produto.prodno, produto.valor_unit, produto.unino, produto.sta, produto.userno];

        pool.query(sql, values, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              console.error('Erro ao inserir produto no banco de dados:', err);
              connection.release();
              res.status(500).send('Erro ao inserir produto no banco de dados');
            });
          }
        }); 
      });
 
      connection.commit(err => {
        if (err) {
          return pool.rollback(() => { 
            console.error('Erro ao commitar transação:', err);
            connection.release();
            res.status(500).send('Erro ao commitar transação');
          });
        }

        console.log('Transação commitada com sucesso.');
        connection.release(); 
        res.send('Pedido enviado com sucesso!');
      });
    });
  });
});

router.get('/liuser', (req, res) => {
  const query = 'SELECT * FROM usuario';
  
  pool.query(query, (err, results) => {
    if (err) {
      res.status(404).json({ success: false,  error: ['Erro ao listar usuários']});
    } else {
      res.status(200).json({success: true, data: results})
    };
  })
})

router.get('/nextped', (req, res) => {
  pool.query('SELECT MAX(pedido) AS maxProdNo FROM pedidos', (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      res.status(500).send('Erro ao buscar próximo prodno');
      return;
    }

    const proximoProdNo = results[0].maxProdNo + 1;
    res.json({ success: true, message: proximoProdNo});
  });
});

router.get('/busca', (req, res) => {
  const { no } = req.body;
  const values = [ no ]
  const query = 'SELECT * FROM estoque WHERE no = ?';

  pool.query(query, values, (err, results) => {
    
    if (results.length === 0) {
      res.status(404).json({ success: true, message:['Nenhum produto encontrado']})
    }
    
    if (err) {
      res.status(500).json({ success: false, error:['Por favor contatar o adminstrador']})
    } else {
      res.status(200).json(results)
    }
  })
})

// teste rota up
app.post('/up', async (req, res) => {
  try {
    // Verifica se a requisição contém um arquivo de imagem
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida' });
    }

    // Salva o arquivo de imagem no sistema de arquivos temporário
    const imageFile = req.files.image;
    const imagePath = path.join(__dirname, 'temp', imageFile.name);
    await imageFile.mv(imagePath);

    // Processa a imagem com Tesseract.js
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: info => console.log(info) }
    );

    // Extrai números do texto reconhecido
    const numerosEncontrados = extrairNumeros(text);

    // Retorna os números encontrados como resposta JSON
    res.json({ numerosEncontrados });

    // Remove o arquivo temporário
    await fs.unlink(imagePath);
  } catch (error) {
    console.error('Erro ao processar a imagem:', error);
    res.status(500).json({ error: 'Erro ao processar a imagem' });
  }
});

function extrairNumeros(texto) {
  const regexNumeros = /[-+]?\b\d+(\.\d+)?\b/g;
  return texto.match(regexNumeros) || [];
}


module.exports = router;
