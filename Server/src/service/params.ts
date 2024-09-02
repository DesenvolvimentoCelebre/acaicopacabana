import pool from "../database/connection";

async function  acaiPrice(novovalor:number) {
    try {
        const query = "UPDATE sys SET val = ? WHERE id = 1";
        await pool.query(query, [novovalor]);

        return {
            success: true,
            message: ['Preço do açai atualizado com sucesso']
        }
    } catch (error) {
        return {
            success: false,
            message: ['Erro ao atualiar preço do açai']
        }
    }
}

async function getConfigById(id: number) {
    try {
      const query = "SELECT * FROM sys WHERE id = ?";
      const [results] = await pool.query(query, [id]);
      
      return { 
        success: true,
        data: results };
   
    } catch (error) {
      return { success: false, error: 'Por favor contate o administrador', details: error };
    }
  }

export default {
    acaiPrice,
    getConfigById
}