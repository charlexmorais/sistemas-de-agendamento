import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const app: Express = express();
app.listen(3000, () => {
  console.log("SERVER RUN:3000");
});

app.use(bodyParser.json());

export interface Medico {
  id: string;
  nome: string;
  crm: string;
}

export interface Paciente {
  id: string;
  nomepaciente: string;
  rg: string;
}

export interface Consulta {
  id: string;
  descricao: string;
  data: Date;
  paciente_id: string;
  medico_id: string;
}

const medicos: Medico[] = [];
const pacientes: Paciente[] = [];
const consultasCadastradas:Consulta[] = [];
const secretKeyMedico = "10203040";
const secretKeyPaciente = "10203050";
const secretKeyConsulta = "10203060";

// Cadastro de Médico
app.post("/medicos", (req: Request, res: Response) => {
  const { nome, crm } = req.body as { nome: string; crm: string };

  if (!nome || !crm) {
    return res
      .status(400)
      .json({ error: "Por favor, preencha todos os campos..." });
  }

  const existingUser = medicos.find((user) => user.nome === nome);
  if (existingUser) {
    return res.status(409).json({ error: "Usuário já existe" });
  }

  const newUser: Medico = {
    id: uuidv4(),
    nome,
    crm,
  };

  medicos.push(newUser);
  res
    .status(201)
    .json({ message: "Médico cadastrado com sucesso", user: newUser });
});

// Login de Médico
app.post("/login/medico", (req: Request, res: Response) => {
  const { nome, crm } = req.body as { nome: string; crm: string };

  const medico = medicos.find((m) => m.nome === nome && m.crm === crm);

  if (medico) {
    const token = jwt.sign({ nome, crm }, secretKeyMedico, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

// Listar Médicos
app.get("/medicos", (req: Request, res: Response) => {
  res.json(medicos);
});

// Atualizar Médico
app.put("/medicos/:id", (req: Request, res: Response) => {
  const atualizaMedicoId = req.params.id;
  const { nome, crm } = req.body as { nome: string; crm: string };

  const medicoIndex = medicos.findIndex((m) => m.id === atualizaMedicoId);
  if (medicoIndex === -1) {
    return res.status(404).json({ error: "Médico não encontrado." });
  }

  const medicoAtualizado: Medico = {
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
app.delete("/medicos/:id", (req: Request, res: Response) => {
  const medicoIdToDelete = req.params.id;

  const medicoIndex = medicos.findIndex((m) => m.id === medicoIdToDelete);
  if (medicoIndex === -1) {
    return res.status(404).json({ error: "Médico não encontrado." });
  }

  medicos.splice(medicoIndex, 1);
  res.json({ message: "Médico excluído com sucesso" });
});


// Cadastro de Paciente
app.post("/pacientes", (req: Request, res: Response) => {
  const { nomepaciente, rg } = req.body as { nomepaciente: string; rg: string };

  if (!nomepaciente || !rg) {
    return res
      .status(400)
      .json({ error: "Por favor, preencha todos os campos..." });
  }

  const existingUser = pacientes.find(
    (user) => user.nomepaciente === nomepaciente
  );
  if (existingUser) {
    return res.status(409).json({ error: "Usuário já existe" });
  }

  const newUser: Paciente = {
    id: uuidv4(),
    nomepaciente,
    rg,
  };

  pacientes.push(newUser);
  res
    .status(201)
    .json({ message: "Paciente cadastrado com sucesso", user: newUser });
});

// Login de Paciente
app.post("/login/pacientes", (req: Request, res: Response) => {
  const { nomepaciente, rg } = req.body as { nomepaciente: string; rg: string };

  const pacienteEncontrado = pacientes.find(
    (p) => p.nomepaciente === nomepaciente && p.rg === rg
  );

  if (pacienteEncontrado) {
    const token = jwt.sign({ nomepaciente, rg }, secretKeyPaciente, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Erro, digite novamente ..." });
  }
});

// Listar Pacientes
app.get("/pacientes", (req: Request, res: Response) => {
  res.json(pacientes);
});

// Atualizar Paciente
app.put("/pacientes/:id", (req: Request, res: Response) => {
  const atualizaPacienteId = req.params.id;
  const { nomepaciente, rg } = req.body as { nomepaciente: string; rg: string };

  const pacienteIndex = pacientes.findIndex((p) => p.id === atualizaPacienteId);
  if (pacienteIndex === -1) {
    return res.status(404).json({ error: "Paciente não encontrado." });
  }

  const pacienteAtualizado: Paciente = {
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
app.delete("/pacientes/:id", (req: Request, res: Response) => {
  const pacienteIdToDelete = req.params.id;

  const pacienteIndex = pacientes.findIndex((p) => p.id === pacienteIdToDelete);
  if (pacienteIndex === -1) {
    return res.status(404).json({ error: "Paciente não encontrado." });
  }

  pacientes.splice(pacienteIndex, 1);
  res.json({ message: "Paciente excluído com sucesso" });
});

// agendar consulta 
app.post("/agendar/consultas", (req: Request, res: Response) => {
    const { descricao, data, paciente_id, medico_id } = req.body as {
      descricao: string;
      data: Date;
      paciente_id: string;
      medico_id: string;
    };
  
    if (!descricao || !data || !paciente_id || !medico_id) {
      return res
        .status(400)
        .json({ error: "Por favor, preencha todos os campos..." });
    }
  
    const existingConsulta = consultasCadastradas.find(
      (user) => user.data === data
    );
    if (existingConsulta) {
      return res.status(409).json({ error: "ERRO,Consulta já foi cadastrada" });
    }
  
    const newConsulta: Consulta = {
      id: uuidv4(),
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
app.get("/listar/consultas",(req:Request,res:Response)=>{
    res.json(consultasCadastradas);
})
// atualizando consulta 
app.put("/atualizando/consultas/:id", (req: Request, res: Response) => {
  const atualizaConsulta = req.params.id;
  const { descricao, data, paciente_id, medico_id } = req.body as {
    descricao: string;
    data: Date;
    paciente_id: string;
    medico_id: string;
  };

  console.log("Dados recebidos:", descricao, data, paciente_id, medico_id);

  const consultasIndex = consultasCadastradas.findIndex(
    (c) => c.id === atualizaConsulta
  );
  if (consultasIndex === -1) {
    return res.status(400).json("consulta nao encontrada");
  }

  const consultaAtualizada: Consulta = {
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

app.delete("/deletar/consultas/:id" ,(req:Request,res:Response)=>{
    const excluindoConsultas = req.params.id;
    const excluindoIndex=consultasCadastradas.findIndex((c)=>c.id === excluindoConsultas)
    if(excluindoIndex === -1){
       return res.status(401).json("consulta nao encontrada")
    }
  consultasCadastradas.splice(excluindoIndex,1)
    res.json({message:"consulta excluida com sucesso"});
}); 
