var Sumbudget, incomeArray=[],incNumID=0,Totalinc,ExpensesArrayt=[],ExpNumID=0,Totalexp,element,html,actionsArray=[],actNumID=0;
var BudgetObj,type,url,actionObj,numID;
var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
}; 

//current month + year

var now, year, month, months;
            
now = new Date();
months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
month = now.getMonth();
year = now.getFullYear();



if (numID!=2){
    document.getElementById("budget__title--month").innerHTML=months[month] + ' ' + year;
    getIncomesOutcomes();
}

function AddValue (){
    if (document.getElementById("id_top_desc").value !== "" && !isNaN(document.getElementById("id_top_value").value) && document.getElementById("id_top_value").value > 0) { 
        BudgetObj = new Object();
        BudgetObj.description = document.getElementById("id_top_desc").value; 
        BudgetObj.amount=document.getElementById("id_top_value").value;
        BudgetObj.Percentages=0;

        actionObj = new Object();
        actionObj.operation = "create"; 
        actionObj.date=now.toLocaleDateString('en-GB');
        actionObj.hour=now.getHours();        
        actionObj.description=BudgetObj.description;  
        actionObj.amount=BudgetObj.amount;  
        
        if (document.getElementById("id_Plus").value=="inc"){
            element = DOMstrings.incomeContainer;
            type="inc";
            actionObj.type="inc";
            url='/incomes';
            
            html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            addElementAxios(element,type,url,html);
        }
        else{
            element = DOMstrings.expenseContainer;
            type="exp";
            actionObj.type="exp";
            url='/outcomes';
            
            html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            addElementAxios(element,type,url,html) ;           
        }

    }       
}
function addElementAxios(element,type,url,html){
    axios.post(url, {
        description: BudgetObj.description,
        amount: BudgetObj.amount
      })
      .then(function (response) {
        console.log("response.data" + response);
        
        if (type=="inc"){
            incomeArray[incNumID]=response.data; 
            incNumID++;  
        }
        else{
            ExpensesArrayt[ExpNumID]= response.data;
            ExpNumID++;
        }
        addElement(response.data,element,type,html);
        clearFields(); 
        calculateBudget();
        calculatePercentages();  
        actionsPostAxios(actionObj);      
      })
      .catch(function (error) {
        console.log(error);
        document.getElementById("error").innerText+="Add problem.";
        document.getElementById("error").style.display = "block";
      });
}

function actionsPostAxios(actionObj){
    axios.post("/actions", {
        operation: actionObj.operation,  
        date: actionObj.date,
        hour: actionObj.hour,
        type: actionObj.type,
        description: actionObj.description,
        amount: actionObj.amount
    })
    .then(function (response) {
        console.log("action data" + response);
        actionsArray[actNumID]= response.data;
        actNumID++;
    })
    .catch(function (error) {
        console.log(error);
    });         
}
function addElement(BudgetObj,element,type,html){
    var  newHtml ;
    BudgetObj.id=type + "-" + BudgetObj.id;
    // replace placeholder text with some actual data
    newHtml = html.replace('%id%', BudgetObj.id);
    newHtml = newHtml.replace('%description%', BudgetObj.description);
    newHtml = newHtml.replace('%value%', formatNumber(BudgetObj.amount, type));
    
    // insert the HTML into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);     

}

function getIncomesOutcomes(){

    actionObj = new Object();
    actionObj.operation = "get"; 
    actionObj.date=now.toLocaleDateString('en-GB');
    actionObj.hour=now.getHours();  
    actionObj.type="get" ;
    actionObj.amount=0;         

    element = DOMstrings.incomeContainer;
    type="inc";
    url='/incomes';
    html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    get(element,type,url,html,"get-inc");

    element = DOMstrings.expenseContainer;
    html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    type="exp";
    url='/outcomes';    
    get(element,type,url,html,"get-exp");
 
}
function get(element,type,url,html,description){
    var array,incNum;
    axios.get(url)
    .then(function (response) {
        array = response.data;
        for (let index = 0; index < array.length; index++) {
            addElement(array[index],element,type,html);
        }
        incNum=array.length;
        if (type=="inc"){
            incomeArray =array;
            incNumID=incNum;
        }
        else{
            ExpensesArrayt =array;
            ExpNumID=incNum;
        }
        calculateBudget();
        calculatePercentages(); 
        console.log(actionObj)  ;
        actionObj.description= description;
        actionsPostAxios(actionObj);   
        
        axios.get("/actions")
        .then(function (response) {
            actionsArray = response.data;
            actNumID=actionsArray.length;
                
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.getElementById("error").innerText+="Read problem.";
            document.getElementById("error").style.display = "block";
        })           

    })
    .catch(function (error) {
        // handle error
        console.log(error);
        document.getElementById("error").innerText+="Read problem.";
        document.getElementById("error").style.display = "block";
    })   
}

function clearFields(){
    document.getElementById("id_top_desc").value="";
    document.getElementById("id_top_value").value="";
}
function calculateBudget(){
    var totalpercentage;
    Totalinc=0;Totalexp=0;
    for (index = 0; index < incomeArray.length; index++) {
        Totalinc += Number(incomeArray[index].amount);
    }
    for (index = 0; index < ExpensesArrayt.length; index++) {
        Totalexp += Number(ExpensesArrayt[index].amount);
    }    
    Sumbudget=Totalinc-Totalexp;
    if (Totalinc>0){
        totalpercentage = Math.round( (Totalexp / Totalinc) * 100 );
    }
    else{
        totalpercentage = -1;
    }

    document.querySelector(DOMstrings.budgetLabel).innerHTML= formatNumber(Sumbudget, type);
    document.querySelector(DOMstrings.incomeLabel).innerHTML = formatNumber(Totalinc, 'inc');
    document.querySelector(DOMstrings.expensesLabel).innerHTML = formatNumber(Totalexp, 'exp');

    if (totalpercentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).innerHTML = totalpercentage + '%';
    } else {
        document.querySelector(DOMstrings.percentageLabel).innerHTML = '---';
    }

}

function calculatePercentages(){

    var fields = document.querySelectorAll(DOMstrings.expPercentageLabel); // this returns a node list
    nodeListForEach(fields, function(current, index){ 
        
        if (Math.round(Number(ExpensesArrayt[index].amount)/Totalinc*100) > 0) {
            // current.textContent = percentagesArr[index] + '%';
            current.textContent = Math.round(Number(ExpensesArrayt[index].amount)/Totalinc*100)
        } else {
            current.textContent = '---';
        }
    
    });
}
// enter
document.addEventListener('keypress', function (event) {

    // use .which to add support for older browsers
    if (event.keyCode === 13 || event.which === 13) {
        AddValue();
    }

});
var nodeListForEach = function(list, callbackFn) {
    for (var i = 0; i < list.length; i++) {
        
        // current is the item in the array
        // i is the index
        // in each iteration, the callback function gets called 
        callbackFn(list[i], i);    
    }
    
};
if (numID!=2){
    document.querySelector(DOMstrings.inputType).addEventListener('change', changedType);
    document.querySelector(DOMstrings.container).addEventListener('click', DeleteItem);
    
}

function changedType() {
          
    var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' + 
        DOMstrings.inputDescription + ',' + 
        DOMstrings.inputValue);
    //console.log(fields);
    
    nodeListForEach(fields, function(current){
        current.classList.toggle('red-focus');
    });
    
    document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    
}


function DeleteItem(){      

    var itemID, splitID, ID;
    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 
    console.log(itemID);
    actionObj = new Object();
    actionObj.operation = "delete"; 
    actionObj.date=now.toLocaleDateString('en-GB');
    actionObj.hour=now.getHours();  

    if (itemID) {
        
        // inc-# or exp-#
        // use split - JS converts string to an Object and will return and array
        splitID = itemID.split('-');
        
        type = splitID[0];            
        ID = parseInt(splitID[1]); // use parseInt to convert the string '1' to number 1
    }
    console.log(ExpensesArrayt);
    console.log(incomeArray);

    if(type=="exp"){
        actionObj.type="exp";
        for (index = 0; index < ExpensesArrayt.length; index++) {
            if ( ExpensesArrayt[index].id == itemID) {
                actionObj.description=ExpensesArrayt[index].description; 
                actionObj.amount=ExpensesArrayt[index].amount;                  
                ExpensesArrayt.splice(index, 1); 
                ExpNumID--;
            }            
        }    
        url = `/outcomes/${ID}`;
    }
    else{
        actionObj.type="inc";
        for (index = 0; index < incomeArray.length; index++) {
            if ( incomeArray[index].id == itemID) {
                actionObj.description=incomeArray[index].description; 
                actionObj.amount=incomeArray[index].amount;                  
                incomeArray.splice(index, 1); 
                incNumID--;
            }            
        }
        url = `/incomes/${ID}`;
        // url = `/incomes/${itemID}`;
    }
    
    axios.delete(url)
    .then(function (response) {
      // handle success
  
      if(response.status ==200){
       
          var el = document.getElementById(itemID); 
          el.parentNode.removeChild(el);
          
          calculateBudget();
          calculatePercentages();  
          actionsPostAxios(actionObj);      
      }
      else{
          console.log(`status : ${response.status}`)
          document.getElementById("error").innerText+="Delete problem.";
          document.getElementById("error").style.display = "block";

      }
  
    })
    .catch(function (error) {
      // handle error
        console.log(error);
        document.getElementById("error").innerText+="Delete problem.";
        document.getElementById("error").style.display = "block";
 
    })
};


var formatNumber = function(num, type) {
    var numSplit, int, dec;
    // + or - before the number
    // exactly 2 decimal points
    // comma separating the thousands

    num = Math.abs(num); // find abs value of the number
    num = num.toFixed(2); // make num exactly 2 decimals
    // this is now a string, so use split
    numSplit = num.split('.');
    // find the integer
    int = numSplit[0];

    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    // find the decimal
    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; 

};
