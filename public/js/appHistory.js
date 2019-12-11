
getActions();
function getActions(){

    myBody = document.getElementsByTagName("body")[0];

    // now, get all the p elements that are descendants of the body
    myBodyElements = myBody.getElementsByTagName("th");
  
    // get the second item of the list of p elements
    for (let index = 0; index < myBodyElements.length; index++) {
        const element = myBodyElements[index];
        // if (index!=1){
        //     element.style.padding = "0px 40px 0px 0px";
        // }else{
            element.style.padding = "0px 10px 0px 0px";    
        // }
    }

    // document.getElementsByTagName("th").style.padding = "0px 0px 0px 30px";
    html = '<tr><td>%operation%</td><td>%date%</td><td>%type%</td><td>%description%</td></tr>'

    var array,incNum;
    axios.get('/actions')
    .then(function (response) {
        array = response.data;
        for (let index = 0; index < array.length; index++) {
            addElement(array[index],html);
        }

        myBodyElementsTd = myBody.getElementsByTagName("td");
  
        // get the second item of the list of p elements
        for (let index = 0; index < myBodyElementsTd.length; index++) {
            const element = myBodyElementsTd[index];

            // if (index!=1){
            //     element.style.padding = "0px 40px 0px 0px";
            // }else{
                element.style.padding = "0px 20px 0px 0px";    
            // }


            // element.style.padding = "0px 60px 0px 0px";    
        }        
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        document.getElementById("error").innerText+="Read problem.";
        document.getElementById("error").style.display = "block";
    })   
 
}


function addElement(BudgetObj,html){
    var  newHtml,string ;
    string=BudgetObj.date + ' ' + BudgetObj.hour + ":00";
    console.log(string);
    newHtml = html.replace('%operation%', BudgetObj.operation);
    newHtml = newHtml.replace('%date%', string);
    newHtml = newHtml.replace('%type%', BudgetObj.type);
    newHtml = newHtml.replace('%description%', BudgetObj.description);
    
    // insert the HTML into the DOM
    document.querySelector('table').insertAdjacentHTML('beforeend', newHtml);     

}
