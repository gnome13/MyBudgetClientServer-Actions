const express = require("express");
const app = express(),
  PORT = 8080;
const routeHelper=require("./incomes_outcomes");
const path = require("path");
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// --- used for json in body
app.use(express.json());
let idsIncome = 3;
let idsOutcome=3;
let idactions=3;

const incomes = [
  { description: "salary 1", amount: 26000, id: 1 },
  { description: "salary 2", amount: 12000, id: 2 }
];
const outcomes = [
    { description: "super 1", amount: 200, id: 1 },
    { description: "super 2", amount: 120, id: 2 }
  ];
  const actions = [
    { id: 1, operation: "get", date: "10/10/2019", hour: 10,type:"exp", description:"salary 1", amount: 15000 },
    { id: 2, operation: "get", date: "10/10/2019", hour: 11,type:"exp", description:"salary 2", amount: 12000 }
  ];  

// --- read
app.get("/incomes", (req, res) => {
  routeHelper.handleGet(incomes,req,res);
});

// --- read
app.get("/outcomes", (req, res) => {
    routeHelper.handleGet(outcomes,req,res);
});
// --- read
app.get("/actions", (req, res) => {
    res.send(actions);
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname+'/error404.html'));
});

// update
app.put("/incomes/:id", (req, res) => {
  const id = req.params.id;
  const updatedIncome = req.body;

  // --- validate the descption length > 0 , amount > 0
  // --- if not return status code 400 - BAD REQUEST

  if (isValidationOk(updatedIncome.description, updatedIncome.amount)) {
    // --- input is valid
    const index = incomes.findIndex(it => it.id == id);
    if (index == -1) {
      res.sendStatus(404);
    } else {
      incomes[index] = updatedIncome;
      res.send(updatedIncome);
    }
  } else {
    // --- input is not valid
    res.sendStatus(400);
  }
});

// delete
app.delete("/incomes/:id", (req, res) => {
  routeHelper.handleDelete(incomes,req,res);
});

// delete
app.delete("/outcomes/:id", (req, res) => {
  routeHelper.handleDelete(outcomes,req,res);
});

// --- create
app.post("/incomes", (req, res) => {
  routeHelper.handleCreate(incomes,req,res,idsIncome);
  idsIncome++;
});

app.post("/outcomes", (req, res) => {
  routeHelper.handleCreate(outcomes,req,res,idsOutcome);
  idsOutcome++;
});

app.post("/actions", (req, res) => {
  const newaction = {
    id: idactions,
    operation: req.body.operation,
    date: req.body.date,
    hour: req.body.hour,
    type: req.body.type,
    description: req.body.description,
    amount: req.body.amount
  };
  if ((newaction.operation.length > 0) && (newaction.date.length > 0) && (newaction.type.length > 0)) {
    
    actions.push(newaction);
    res.status(201).send(newaction);
  } 
  else {
    // --- input is not valid
    res.sendStatus(400);
  }
  idactions++;
});

app.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});