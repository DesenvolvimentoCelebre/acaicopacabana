const express = require("express");
const params = express.Router();
const { updateAcaiPrice, getConfigById, valueAcai, taxCoupon, lock, unlock, getlogo, getImp, insertImp, delImp, reciviedType, putReciviedTpe } = require('../../service/params');
const { sendErrorMessage } = require('../../utils/intTelegram');
const passport = require('passport');

params.put("/acai", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { valor_peso } = req.body;
        const result = await updateAcaiPrice(valor_peso);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            sendErrorMessage(`Erro na rota /acai: ${JSON.stringify(result)}`);
            res.status(500).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /acai: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

params.get("/red", async (req, res) => {
    try {
        const result = await getConfigById(2);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /red: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /red: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

params.get("/yellow", async (req, res) => {
    try {
        const result = await getConfigById(3);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /yellow: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /yellow: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

params.get("/blue", async (req, res) => {
    try {
        const result = await getConfigById(4);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /blue: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /blue: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

params.get("/acai", async (req, res) => {
    try {
        const result = await valueAcai(1);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /acai: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /acai: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

params.get("/empresa", async (req, res) => {
    try {
        const results = await taxCoupon(1);
        if (results.success) {
            res.status(200).json(results.data);
        } else {
            sendErrorMessage(`Erro na rota /empresa: ${JSON.stringify(results)}`);
            res.status(500).json({ success: false, error: "Erro ao buscar parâmetros da empresa" });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /empresa: ${error.message}`);
        res.status(500).json({ success: false, error: ['Por favor contate o administrador'] });
    }
});

params.get("/lock", async (req, res) => {
    const result = await lock();
    if (result.success) {
        res.status(200).json(result);
    } else {
        sendErrorMessage(`Erro na rota /lock: ${JSON.stringify(result)}`);
        res.status(500).json(result);
    }
});

params.put("/lock", async (req, res) => {
    const { pp } = req.body;
    const result = await unlock(pp);
    if (result.success) {
        res.status(200).json(result);
    } else {
        sendErrorMessage(`Erro na rota /lock (PUT): ${JSON.stringify(result)}`);
        res.status(500).json(result);
    }
});

params.get("/logo", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const result = await getlogo();
    if (result.success) {
        res.status(200).json(result);
    } else {
        sendErrorMessage(`Erro na rota /logo: ${JSON.stringify(result)}`);
        res.status(500).json(result);
    }
});

params.get("/imp", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const result = await getImp();
    if (result.success) {
        res.status(200).json(result);
    } else {
        sendErrorMessage(`Erro na rota /imp: ${JSON.stringify(result)}`);
        res.status(500).json(result);
    }
});

params.post("/imp", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { label, ip } = req.body;
    const result = await insertImp(label, ip);
    if (result.success) {
        res.status(200).json(result);
    } else {
        sendErrorMessage(`Erro na rota /imp (POST): ${JSON.stringify(result)}`);
        res.status(500).json(result);
    }
});

params.delete("/imp/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params;
    const result = await delImp(id);
    if (result.success) {
        res.status(200).json(result);
    } else {
        sendErrorMessage(`Erro na rota /imp (DELETE): ${JSON.stringify(result)}`);
        res.status(500).json(result);
    }
});

params.get("/rec", async (req, res) => {
    const result = await reciviedType();

    if (result.success) {
        res.status(200).json(result)
    } else {
        sendErrorMessage(`Erro na rota /rec GET: ${JSON.stringify(result)}`)
        res.status(500).json(result)
    }
})

params.put("/rec", async (req, res) => {
    const { bit } = req.body;
    const result = await putReciviedTpe(bit)

    if (result.success) {
        res.status(200).json(result)
    } else {
        sendErrorMessage(`Erro na rota /rec PUT ${JSON.stringify(result)}`)
        res.status(500).json(result)
    }
})

module.exports = params;
