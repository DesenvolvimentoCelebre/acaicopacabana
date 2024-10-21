const express = require("express");

const params = express.Router();

const { updateAcaiPrice, getConfigById, valueAcai, taxCoupon, lock, unlock, getlogo, getImp, insertImp, delImp } = require('../../service/params');
const { errorMiddleware } = require('../../utils/intTelegram')
const passport = require('passport');

params.put("/acai", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const { valor_peso } = req.body;
    const result = await updateAcaiPrice(valor_peso);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao atulizar valor do açai ${err}`))
  }
});

params.get("/red", async (req, res, next) => {
  try {
    const result = await getConfigById(2);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao buscar configuração "red":', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    const err = error;
    next(new Error(`Erro ao buscar configuração de status, ${err}`))
  }
});

params.get("/yellow", async (req, res, next) => {
  try {
    const result = await getConfigById(3);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao buscar configuração "yellow":', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    const err = error;
    next(new Error(`Erro ao buscar configuração de status, ${err}`))
  }
});

params.get("/blue", async (req, res, next) => {
  try {
    const result = await getConfigById(4);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao buscar configuração "blue":', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    const err = error;
    next(new Error(`Erro ao buscar configuração de status, ${err}`))
  }
});

params.get("/acai", async (req, res, next) => {
  try {
    const result = await valueAcai(1);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao buscar configuração "blue":', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    const err = error;
    next(new Error(`Erro ao buscar valor do açaí, ${err}`))
  }
});

params.get("/empresa", async (req, res, next) => {
  try {
    const results = await taxCoupon(1);
    if (results.success) {
      res.status(200).json(results.data)
    } else {
      res.status(500).json({ success: false, error: "Erro ao buscar parâmetros da empresa"});
    }
  } catch (error) {
    res.status(500).json({ success: false, error: ['Por favor contate o administrador']})
    const err = error;
    next(new Error(`Erro ao puxar informações da empresa, ${err}`))
  }
})

params.get("/lock", async (req, res) => {
	const result = await lock();

	if (result.success){
		res.status(200).json(result)
	} else {
		res.status(500).json(result)
	  }
})

params.put("/lock", async (req, res) => {
	const {pp} = req.body;
	const result = await unlock(pp)

	if (result.success) {
	  res.status(200).json(result)
	} else {
	  res.status(500).json(result)
	}
})

params.get("/logo", passport.authenticate("jwt", { session: false }),async (req, res) => {
  const result = await getlogo();

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(500).json(result)
  }
})

params.get("/imp", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const result = await getImp();

  if (result.success === true) {
    res.status(200).json(result)
  } else {
    res.status(500).json(result)
  }
})

params.post("/imp",passport.authenticate("jwt", { session: false }), async (req, res) => {
  const {label, ip} = req.body;
  const result = await insertImp(label, ip)

  if (result.success) {
    res.status(200).json(result)
  } else {
    res.status(500).json(result)
  }
})

params.delete("/imp/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { id } = req.params; // Extraí o ID da URL
  const result = await delImp(id); // Chama a função delImp com o ID

  if (result.success) {
    res.status(200).json(result); // Retorna sucesso
  } else {
    res.status(500).json(result); // Retorna erro
  }
});


params.use(errorMiddleware);

module.exports = params;
