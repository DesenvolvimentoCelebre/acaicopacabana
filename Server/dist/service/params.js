"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
function acaiPrice(novovalor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "UPDATE sys SET val = ? WHERE id = 1";
            yield connection_1.default.query(query, [novovalor]);
            return {
                success: true,
                message: ['Preço do açai atualizado com sucesso']
            };
        }
        catch (error) {
            return {
                success: false,
                message: ['Erro ao atualiar preço do açai']
            };
        }
    });
}
function getConfigById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = "SELECT * FROM sys WHERE id = ?";
            const [results] = yield connection_1.default.query(query, [id]);
            return {
                success: true,
                data: results
            };
        }
        catch (error) {
            return { success: false, error: 'Por favor contate o administrador', details: error };
        }
    });
}
exports.default = {
    acaiPrice,
    getConfigById
};
