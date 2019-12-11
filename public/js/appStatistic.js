var Sumbudget, incomeArray=[],incNumID=0,Totalinc,ExpensesArrayt=[],ExpNumID=0,Totalexp,element,html,actionsArray=[],actNumID=0;
var BudgetObj,type,url,actionObj;
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
var numID=2;

Calculete(2);

function Calculete(num){

    element = '.income__list';
    type="inc";
    url='/incomes';
    Calculeteget(element,type,url,"get-inc");

    element = '.expenses__list';
    type="exp";
    url='/outcomes';    
    Calculeteget(element,type,url,"get-exp");
    if(num==1){
        axios.get('/actions')
        .then(function (response) {
            actionsArray = response.data;
            var dateFrom = Date.parse(document.getElementById("iddatefrom").value);
            var dateFromNew = new Date(dateFrom);
            var dateTo = Date.parse(document.getElementById("iddateto").value);
            var dateToNew = new Date(dateTo);                        
            array = actionsArray.filter(item=> item.date >= dateFromNew.toLocaleDateString('en-GB') && item.date <= dateToNew.toLocaleDateString('en-GB') );
            console.log(actionsArray);
            console.log(array);
            array = array.filter(item=> item.hour >= document.getElementById("idhourfrom").value && item.hour<=document.getElementById("idhourto").value);
            console.log(array);
            Totalexp=0;
            Totalinc=0;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if(element.operation =="create" && element.type == "exp"){
                    Totalexp += Number(element.amount);
                }
                if(element.operation =="create" && element.type == "inc"){
                    Totalinc += Number(element.amount);   
                } 
                if(element.operation =="delete" && element.type == "exp"){
                    Totalexp -= Number(element.amount);
                }
                if(element.operation =="delete" && element.type == "inc"){
                    Totalinc -= Number(element.amount);   
                }                                   
            }
            console.log(Totalinc,Totalexp);
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

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.getElementById("error").innerText+="Read problem.";
            document.getElementById("error").style.display = "block";
        })   
    }
 
}
function Calculeteget(element,type,url,description){
    var array,incNum;
    axios.get(url)
    .then(function (response) {
        array = response.data;
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
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        document.getElementById("error").innerText+="Read problem.";
        document.getElementById("error").style.display = "block";
    })   
}


