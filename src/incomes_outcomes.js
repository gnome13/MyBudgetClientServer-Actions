
function isValidationOk(description, amount) {
  return (description.length > 0) && (amount > 0);
}

function handleGet(array,req,res){
  {
      if (req.query.description == undefined) {
        // got /incomes
        res.send(array);
      } else {
        // got e.g. /incomes?description=salary 1
        // -- got query string -> req.query.description
        const item = array.find(it => it.description == req.query.description);
        if (item == undefined) {
          res.sendStatus(404);
        } else {
          res.send(item);
        }
      }
    }
}

function handleDelete(array,req,res){
    const index = array.findIndex(it => it.id == req.params.id);
    // --- need to check index is ok
    if (index == -1) {
      res.sendStatus(404);
    } else {
      array.splice(index, 1);
      res.sendStatus(200);
    }
}

function handleCreate(array,req,res,ids){
  const newIncome = {
    description: req.body.description,
    amount: req.body.amount,
    id: ids
  };

  if (isValidationOk(newIncome.description, newIncome.amount)) {
    
    array.push(newIncome);
    res.status(201).send(newIncome);
  } else {
    // --- input is not valid
    res.sendStatus(400);
  }
}
module.exports.handleGet = handleGet;
module.exports.handleDelete = handleDelete;
module.exports.handleCreate = handleCreate;

