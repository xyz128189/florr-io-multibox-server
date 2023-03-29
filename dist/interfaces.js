"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Opcodes = void 0;
var Opcodes;
(function (Opcodes) {
    Opcodes[Opcodes["Auth"] = 0] = "Auth";
    Opcodes[Opcodes["Move"] = 1] = "Move";
    Opcodes[Opcodes["Attack"] = 2] = "Attack";
    Opcodes[Opcodes["Defend"] = 3] = "Defend";
    Opcodes[Opcodes["Keyboard"] = 4] = "Keyboard";
    Opcodes[Opcodes["TransferHost"] = 5] = "TransferHost";
    Opcodes[Opcodes["Info"] = 6] = "Info";
})(Opcodes = exports.Opcodes || (exports.Opcodes = {}));
