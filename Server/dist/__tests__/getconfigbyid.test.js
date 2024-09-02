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
const params_1 = __importDefault(require("../service/params"));
describe('getconfigbyid function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should retrieve all settings by id', () => __awaiter(void 0, void 0, void 0, function* () {
        connection_1.default.query.mockResolvedValue([{}]);
        const result = yield params_1.default.getConfigById(1);
        expect(result).toEqual({
            success: true,
            message: result
        });
        expect(connection_1.default.query).toHaveBeenCalledWith('SELECT * FROM sys WHERE id = ?', [1]);
    }));
    it('should handle errors and return failure response', () => __awaiter(void 0, void 0, void 0, function* () {
        connection_1.default.query.mockRejectedValue(new Error('Error retrieving settings'));
        const result = yield params_1.default.getConfigById(1);
        expect(result).toEqual({
            success: false,
            message: 'Error retrieving settings'
        });
    }));
});
