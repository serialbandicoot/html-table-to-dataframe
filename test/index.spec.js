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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const fs_1 = require("fs");
const path_1 = require("path");
test('should correctly sum two numbers', () => __awaiter(void 0, void 0, void 0, function* () {
    const headers = ["Person", "Likes", "Age"];
    const filePath = (0, path_1.join)(__dirname, 'data', 'table1.html');
    const htmlString = yield fs_1.promises.readFile(filePath, 'utf-8');
    const dataFrame = yield (0, index_1.toDataFrame)(htmlString, headers);
    const data = [
        { Person: "Chris", Likes: "HTML tables", Age: "22" },
        { Person: "Dennis", Likes: "Web accessibility", Age: "45" },
        { Person: "Sarah", Likes: "JavaScript frameworks", Age: "29" },
        { Person: "Karen", Likes: "Web performance", Age: "36" },
    ];
    expect(dataFrame).toEqual(data);
}));
