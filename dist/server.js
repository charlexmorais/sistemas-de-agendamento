"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.listen(3000, () => {
    console.log("SERVER RUN:3000");
});
app.use(body_parser_1.default.json());
const medicos = [];
const pacientes = [];
const consultasCadastradas = [];
const secretKeyMedico = "10203040";
const secretKeyPaciente = "10203050";
const secretKeyConsulta = "10203060";
// Cadastro de Médico
app.post("/medicos", (req, res) => {
    const { nome, crm } = req.body;
    if (!nome || !crm) {
        return res
            .status(400)
            .json({ error: "Por favor, preencha todos os campos..." });
    }
    const existingUser = medicos.find((user) => user.nome === nome);
    if (existingUser) {
        return res.status(409).json({ error: "Usuário já existe" });
    }
    const newUser = {
        id: (0, uuid_1.v4)(),
        nome,
        crm,
    };
    medicos.push(newUser);
    res
        .status(201)
        .json({ message: "Médico cadastrado com sucesso", user: newUser });
});
// Login de Médico
app.post("/login/medico", (req, res) => {
    const { nome, crm } = req.body;
    const medico = medicos.find((m) => m.nome === nome && m.crm === crm);
    if (medico) {
        const token = jsonwebtoken_1.default.sign({ nome, crm }, secretKeyMedico, {
            expiresIn: "1h",
        });
        res.json({ token });
    }
    else {
        res.status(401).json({ error: "Credenciais inválidas" });
    }
});
// Listar Médicos
app.get("/medicos", (req, res) => {
    res.json(medicos);
});
// Atualizar Médico
app.put("/medicos/:id", (req, res) => {
    const atualizaMedicoId = req.params.id;
    const { nome, crm } = req.body;
    const medicoIndex = medicos.findIndex((m) => m.id === atualizaMedicoId);
    if (medicoIndex === -1) {
        return res.status(404).json({ error: "Médico não encontrado." });
    }
    const medicoAtualizado = {
        id: atualizaMedicoId,
        nome,
        crm,
    };
    medicos[medicoIndex] = medicoAtualizado;
    res.json({
        message: "Médico atualizado com sucesso",
        medico: medicoAtualizado,
    });
});
// Delete Médico
app.delete("/medicos/:id", (req, res) => {
    const medicoIdToDelete = req.params.id;
    const medicoIndex = medicos.findIndex((m) => m.id === medicoIdToDelete);
    if (medicoIndex === -1) {
        return res.status(404).json({ error: "Médico não encontrado." });
    }
    medicos.splice(medicoIndex, 1);
    res.json({ message: "Médico excluído com sucesso" });
});
// ... Resto do código (Cadastro, Login, Listar e Atualizar Pacientes, Delete Paciente)
// Cadastro de Paciente
app.post("/pacientes", (req, res) => {
    const { nomepaciente, rg } = req.body;
    if (!nomepaciente || !rg) {
        return res
            .status(400)
            .json({ error: "Por favor, preencha todos os campos..." });
    }
    const existingUser = pacientes.find((user) => user.nomepaciente === nomepaciente);
    if (existingUser) {
        return res.status(409).json({ error: "Usuário já existe" });
    }
    const newUser = {
        id: (0, uuid_1.v4)(),
        nomepaciente,
        rg,
    };
    pacientes.push(newUser);
    res
        .status(201)
        .json({ message: "Paciente cadastrado com sucesso", user: newUser });
});
// Login de Paciente
app.post("/login/pacientes", (req, res) => {
    const { nomepaciente, rg } = req.body;
    const pacienteEncontrado = pacientes.find((p) => p.nomepaciente === nomepaciente && p.rg === rg);
    if (pacienteEncontrado) {
        const token = jsonwebtoken_1.default.sign({ nomepaciente, rg }, secretKeyPaciente, {
            expiresIn: "1h",
        });
        res.json({ token });
    }
    else {
        res.status(401).json({ error: "Erro, digite novamente ..." });
    }
});
// Listar Pacientes
app.get("/pacientes", (req, res) => {
    res.json(pacientes);
});
// Atualizar Paciente
app.put("/pacientes/:id", (req, res) => {
    const atualizaPacienteId = req.params.id;
    const { nomepaciente, rg } = req.body;
    const pacienteIndex = pacientes.findIndex((p) => p.id === atualizaPacienteId);
    if (pacienteIndex === -1) {
        return res.status(404).json({ error: "Paciente não encontrado." });
    }
    const pacienteAtualizado = {
        id: atualizaPacienteId,
        nomepaciente,
        rg,
    };
    pacientes[pacienteIndex] = pacienteAtualizado;
    res.json({
        message: "Paciente atualizado com sucesso",
        paciente: pacienteAtualizado,
    });
});
// Delete Paciente
app.delete("/pacientes/:id", (req, res) => {
    const pacienteIdToDelete = req.params.id;
    const pacienteIndex = pacientes.findIndex((p) => p.id === pacienteIdToDelete);
    if (pacienteIndex === -1) {
        return res.status(404).json({ error: "Paciente não encontrado." });
    }
    pacientes.splice(pacienteIndex, 1);
    res.json({ message: "Paciente excluído com sucesso" });
});
//////////////////////////////////
// consulta
// agendar consulta 
app.post("/agendar/consultas", (req, res) => {
    const { descricao, data, paciente_id, medico_id } = req.body;
    if (!descricao || !data || !paciente_id || !medico_id) {
        return res
            .status(400)
            .json({ error: "Por favor, preencha todos os campos..." });
    }
    const existingConsulta = consultasCadastradas.find((user) => user.data === data);
    if (existingConsulta) {
        return res.status(409).json({ error: "ERRO,Consulta já foi cadastrada" });
    }
    const newConsulta = {
        id: (0, uuid_1.v4)(),
        descricao,
        data,
        medico_id,
        paciente_id,
    };
    consultasCadastradas.push(newConsulta);
    res
        .status(201)
        .json({ message: "Consulta cadastrada com sucesso", consulta: newConsulta });
});
// listando consultas cadastradas 
app.get("/listar/consultas", (req, res) => {
    res.json(consultasCadastradas);
});
// atualizando consulta 
app.put("/atualizando/consultas/:id", (req, res) => {
    const atualizaConsulta = req.params.id;
    const { descricao, data, paciente_id, medico_id } = req.body;
    console.log("Dados recebidos:", descricao, data, paciente_id, medico_id);
    const consultasIndex = consultasCadastradas.findIndex((c) => c.id === atualizaConsulta);
    if (consultasIndex === -1) {
        return res.status(400).json("consulta nao encontrada");
    }
    const consultaAtualizada = {
        id: atualizaConsulta,
        descricao,
        data,
        paciente_id,
        medico_id,
    };
    consultasCadastradas[consultasIndex] = consultaAtualizada;
    console.log("Consulta atualizada:", consultaAtualizada);
    res.json({ message: "consulta foi atualizada", consulta: consultaAtualizada });
});
app.delete("/deletar/consultas/:id", (req, res) => {
    const excluindoConsultas = req.params.id;
    const excluindoIndex = consultasCadastradas.findIndex((c) => c.id === excluindoConsultas);
    if (excluindoIndex === -1) {
        return res.status(401).json("consulta nao encontrada");
    }
    consultasCadastradas.splice(excluindoIndex, 1);
    res.json({ message: "consulta excluida com sucesso" });
});
