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
exports.moveTableToStatus = exports.validateFields = void 0;
const validateFields = (fields, body) => {
    const fieldNames = Object.keys(fields);
    fieldNames.filter((field) => {
        return field !== "photo";
    });
    const missingFields = fieldNames.filter((field) => !body[field]);
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
};
exports.validateFields = validateFields;
const moveTableToStatus = (queues, tableNumber, locationId, targetStatus, pool) => __awaiter(void 0, void 0, void 0, function* () {
    if (queues[targetStatus].includes(tableNumber)) {
        return queues;
    }
    const updatedQueues = {
        ready: queues.ready.filter((n) => n !== tableNumber),
        preparing: queues.preparing.filter((n) => n !== tableNumber),
        delivered: queues.delivered.filter((n) => n !== tableNumber),
        payed: queues.payed.filter((n) => n !== tableNumber),
    };
    updatedQueues[targetStatus].push(tableNumber);
    yield pool.query("UPDATE public.Location SET tables_queue = $1 WHERE id = $2", [JSON.stringify(updatedQueues), locationId]);
    return updatedQueues;
});
exports.moveTableToStatus = moveTableToStatus;
