const express = require("express");

const { getcaixa, saldo, abrirCaixa, fechamento, relDiario, getOperador, sangria, ssd, cpUpdate } = require('../../service/system');
const { errorMiddleware } = require('../../utils/intTelegram');

const system = express.Router();

system.get("/gcx", async (req, res) => {
    try {
        const { userno } = req.query
        const result = await getcaixa(userno);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.get("/sd", async (req, res) => {
    try {
        const { userno } = req.query;
        const result = await saldo(userno);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.post("/opc", async (req, res) => {
    try {
      const {s0, sd, userno} = req.body
      const result = await abrirCaixa(s0, sd, userno);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }

    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.post("/fechamento", async (req, res) => {
  try {
      const { userno } = req.body;
      
      if (!userno) {
          return res.status(400).json({ success: false, error: ["userno é necessário"] });
      }
      
      const result = await fechamento(userno);
      
      if (result.success) {
          res.status(200).json(result);
      } else {
          res.status(500).json(result);
      }
  } catch (error) {
      res.status(500).json({ success: false, error: ["Erro interno do servidor", error.message] });
  }
});

system.get("/rdiario", async (req, res) => {
    try {

      const { userno } = req.query
      const result = await relDiario(userno);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }

    

    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.get("/sangria", async (req, res) => {
    try {
        const results = await getOperador();

        if (results.success) {
            res.status(200).json(results);
        } else {
            res.status(500).json(results)
        }
    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor"]})
    }
})

system.post("/sangria", async (req, res) => {
  try {
    const {user_cx, sdret, motivo} = req.body;
    const results = await sangria(user_cx, sdret, motivo);
    
    if (results.success) {
      res.status(200).json(results)
    } else {
      res.status(500).json(results)    
    }
  } catch (error) {
      return {
        success: false,
        error: ['Erro no servidor, contate o administrador']
      }
    }
})

system.get("/sds", async (req, res) => {
  try {
    const {userno} = req.query;
    const results = await ssd(userno);
  
    if (results.success) {
      res.status(200).json(results)
    } else {
      res.status(500).json(results)
    }

  } catch (error) {
    return {
      success: false,
      error: ['Erro ao puxar saldo']
    }
  }
  
})

system.put("/cp", async (req, res) => {
  try {
    const { valor, bit} = req.body;
    console.log(req.body)
  const results = await cpUpdate({bit, valor});

  if (results.success) {
    res.status(200).json(results)
  } else {
    res.status(500).json(results)
  }
  } catch (erro) {
    console.error(erro)
    res.json('Erro ao atualizar parâmetros do cupom fidelidade')
  }
})

system.use(errorMiddleware)

module.exports = system;
