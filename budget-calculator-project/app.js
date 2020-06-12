//******************* BUDGET CONTROLLER ********************

//BUDGET CONTROLLER TO CONTROL THE BUDGET MATHMATICS
var  BudgetController = (function () {
    //We create expense function constructor to be able to add the new properties by add a new methods prototypes
    var Expense = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    };
     //We create income function constructor to be able to add the new properties by add a new methods prototypes and we created it individually because later we will change in the expense function so we need them seperated
    var Income = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };
    // We create a prototype method frome the expense object to calc percentage of each expense
    Expense.prototype.calcPercentage =function (totalIncome) {
           
        if (totalIncome > 1) {
            this.percentage = Math.round((this.value/totalIncome)*100);
        }else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    // we Create function to calculate total by sum each current value for income or expense and add it to the previous sum
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        })
        data.totals[type] = sum;
    }
    
    //We creaete this object with two internal objects one contain arrays of expenses and incomes and the other contains the total of the arrays and the incomes and thats better creating variables flowing everywhere in the code
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0 
        },
        budget: 0,
        percentage: -1
    }
    //create public method that's gonna allow other modules to add new items in our data structure
    return {
        addItem: function (type,des,val) {
            var newItem , ID ;
            //check if there is any id added if there is we will get the id if now we will set the ID = 0
            if (data.allItems[type].length > 0) {
             //Create new ID
            //ID = Last ID + 1;
            ID = data.allItems[type][data.allItems[type].length -1].id + 1;

            }else{
                ID = 0;
            }
           
            //Create new item based "exp" or "inc" type
            if (type === "exp") {
                newItem = new Expense(ID,des,val);
            }else if (type === "inc") {
                newItem = new Income(ID,des,val);
            }
            //push the new item into our data structure
            data.allItems[type].push(newItem);
            //Return the new element 
            return newItem;
        },
        //Create a function to delete item by getting the ids of all the array elements by using map function and it's simillar to foreach method be returning a new brand array that we will use it to get the index of the id that we pass throw the function
        deleteItem: function (type,id) {
          var ids , index;
          // Get a array of all the ids using map method
            ids = data.allItems[type].map(function (current) {
               
                return current.id;
            });
            // Get the index of a specific id that we want to delete
            index = ids.indexOf(id);
            // Check if the index of the id is exist then delete it using splice method with  start the index we have and range of one becuase we want delete only one item per delete operation
            if (index !== -1) {
                data.allItems[type].splice(index , 1);
            }

        },
        //Create a function to calculate the total budget and the percentage by using calculate Total function for the income and the expense that we create before 
        calculateBudget: function () {
            // calculate the total income and expense
            calculateTotal("inc");
            calculateTotal("exp");

            // calculate the budgete : income - expense
             data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of the income that we spent only if the income has a value because any thing divided by 0 is infinity and this not allowed in mathematical
            // we use math round here to ignore the fraction
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }else {

                data.percentage = -1;
            }
            
            
        },
        // Create method to calculate each exp percentage by using foreach method over each element in the array
        calculatePercentage: function () {
            
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })

        },
        // Create method to return each exp percentage value we calculated by using map method over each element in the array and we used map method here becuase as we know it's saving the values and we want to return it so here map method is proper method to do
        getPercentage: function () {
         var allPerc = data.allItems.exp.map(function (cur) {
              return cur.getPercentage();
          })  
          return allPerc;
        },
        //Create function to return the values of the all budget data we calculate before
        getBudget:function () {
            return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
            }
        },

        
        
        testing: function () {
            console.log(data);
        }
    }

})();

//****************** UI CONTROLLER **************************
//UI CONTROLLER TO VIEW RESULTS OF THE BUDGETS TO THE USER
var UIController = (function () {
        //Create an object that contain all our classes to prevent changing all of them all over the code if one of them changed in the future 
        var DomStrings = {
            inputType: ".add__type",
            inputDescription: ".add__description",
            inputValue: ".add__value",
            inputBtn: ".add__btn",
            incomeContainer: ".income__list",
            expenseContainer: ".expenses__list",
            budget: ".budget__value",
            budgetIncome: ".budget__income--value",
            budgetExpense: ".budget__expenses--value",
            budgetExpensePercentage: ".budget__expenses--percentage",
            container: ".container",
            itemExpensePercentage: ".item__percentage",
            dateItem: ".budget__title--month"
        }
            // We create this function to format the number either - or + , make it exactly to decimal points and comma separating the thousand
            //2310.5768 => + 2310,58
           var formatNumber = function (num , type) {
                var numSplit , int , dec , sign;
                // make the number positive only
                num = Math.abs(num);

                //put two decimal after the point only
                num = num.toFixed(2);


                // put the comma for the thousand number
                //split the decimal and intger of the number
                numSplit = num.split(".");
                int = numSplit[0];
                if (int.length > 3) {
                    int = int.substr(0, int.length -3) + "," + int.substr(int.length -3, 3);
                }
                dec = numSplit[1];

                // add the + or - sign to our number

                type === "exp" ? sign = "-" : sign = "+";

                return sign + " " +int +"."+ dec;

            };

             // we create this function to call nodelist function we created for each element of the list to apply a specific function on each element of that list
             var nodeListForEach = function (list,callback) {
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i)
                    
                }
            }

       //create a function that return a function that return the input values we put them
       //here in an object to be able to call them outside the private function if we created
       //them in a normal function they will kepp in the clousure and this prevent us from calling them outside the private field
        return {
            getInput:function () {
                return {
                   type: document.querySelector(DomStrings.inputType).value,// will get the select option either + or -
                   description: document.querySelector(DomStrings.inputDescription).value, // will get the description name field
                    value: parseFloat(document.querySelector(DomStrings.inputValue).value) // will get the value number that we wrote in the input field and it's return as string so will use parse float method to change it to a decimal number
                };
            },

            addListItem: function  (obj, type) {
                var html , newHtml , element;
                
               if (type === "inc") {
                   //bring the container class name of the income from the Domstring list
                   element = DomStrings.incomeContainer;
                // Create HTML string for income with placeholder text
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
               }else if (type === "exp") {
                   //bring the container class name of the expense from the Domstring list
                   element = DomStrings.expenseContainer;
                // Create HTML string for expense with placeholder text
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
               }

              

                // Replace the placeholder with actual real data
               newHtml = html.replace("%id%", obj.id);
               newHtml = newHtml.replace("%description%", obj.description);
               newHtml = newHtml.replace("%value%", formatNumber(obj.value, type) );

                // Insert the HTML in the DOM
                document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
            },
            // Create UI delete item method by passing the element id and then removing this child element from the parent element
            deleteItem: function (elementID) {
                var el;
                el = document.getElementById(elementID);
                el.parentNode.removeChild(el);
            },
            //We creat cleaFields function to clear the whole fields after we add the item
            clearFields: function () {
                var fields , fieldsArr;
                // We will use queryselectorall method here to clear all the field together to prevent writing it twice or more if we  have
                //we seperate the fields selection here by , because it's same ass sperating css class selectors
              fields = document.querySelectorAll(DomStrings.inputValue + "," +DomStrings.inputDescription);
              
              //query selector will return the fields in list and list doesn't have slice method so we call the slice method from the prototype of the array so now we have Array with our fileds
              fieldsArr = Array.prototype.slice.call(fields);
              
              // Now we want to loop all over the fieldArr so we will try foreach loop
              fieldsArr.forEach(function(current , index , array) {
                  
                current.value = "";

              });

              fieldsArr[0].focus();


            },
            //Create a function to manipulate the DOM elements whose will show us the budget data
            displayBudget: function (obj) {
                var type;
                obj.budget > 0 ? type = "inc" : type = "exp";
                //Get all our Dom strings from DomStrings class we created before and our text value from GetBudget function that we return before with all our budget calculated values
                document.querySelector(DomStrings.budget).textContent =formatNumber(obj.budget,type) ;
                document.querySelector(DomStrings.budgetIncome).textContent = formatNumber(obj.totalInc,"inc");
                document.querySelector(DomStrings.budgetExpense).textContent = formatNumber(obj.totalExp, "exp");
               
                
                if (obj.percentage > 0) {
                    
                    document.querySelector(DomStrings.budgetExpensePercentage).textContent = obj.percentage + "%";
                }else {
                    document.querySelector(DomStrings.budgetExpensePercentage).textContent = "--";
                }
            },

            // A function to display the percentage individually for each expense item
            displayPercentage: function (percentages) {

                //we user query selector all beacause we don't know how many expense we will have
                var fields = document.querySelectorAll(DomStrings.itemExpensePercentage);
               
                //We create this function to grap the percentage value for us from the current value
                nodeListForEach(fields, function (current,index) {
                    if (percentages[index] > 0) {
                        
                        current.textContent = percentages[index] + "%";
                    }else {
                        current.textContent ="--";
                    }
                })
            },
            // function to display the current date at the header of the page
            displayDate: function () {
                var date , month , year , months;
                date = new Date();
                year = date.getFullYear();
                month = date.getMonth();
                months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
                monthInText = months[month];
                document.querySelector(DomStrings.dateItem).textContent = monthInText + " " + year;

            },

            // Create a function for changing the css classes of color of the fields depends on the type either exp or inc
            changedType: function (type) {
                
                var fields = document.querySelectorAll(
                    DomStrings.inputType + "," +
                    DomStrings.inputDescription + "," +
                    DomStrings.inputValue
                );
                //Add red border to the three fields
                nodeListForEach(fields,function (cur) {
                    cur.classList.toggle("red-focus");
                });
                //Add red color to the button
                document.querySelector(DomStrings.inputBtn).classList.toggle("red");
            },
           

            // Create another function in another object to return Dom strings outside this private controller and be able to use it in another controllers
            getDomStrings: function () {
                return DomStrings;
            }
        };





})();



// ******************* MAIN CONTROLLER ***********************
// THE WHOLE APP CONTROLLER TO CONTROL THE RESULTS COMING FROM THE BUDGET CONTROLLER AND IMPLEMENT IT TO THE UI CONTROLLER
var Controller = (function (BudgetCtrl , UiCtrl) {
    //We create this function to contain all event listeners that we will create to make tha code more organized
    var setupEventListeners = function () {

     // we will create an instance function from the UiCtrl getDomstrings function to be able to add our classes there
    var Dom = UiCtrl.getDomStrings();

        
    //Creating an event listener to control the actions takes when the button got clicked by the user
    document.querySelector(Dom.inputBtn).addEventListener('click' , CtrlAddItem);


    
    //Creating an event listener to control the actions takes when the enter is pressed by the user
    document.addEventListener("keypress" , function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            CtrlAddItem();
        }
    });

    //Creating an event listener to control the actions takes when the delete button got clicked by the user
    document.querySelector(Dom.container).addEventListener('click', CtrlDeleteItem);

    // Creat an event listener to control the color of the borders in case of expense to red in case of income blue
    document.querySelector(Dom.inputType).addEventListener('change', UiCtrl.changedType)

    };
   
     

    var updateBudget = function () {
        
         //5- Calculate the budget
         BudgetController.calculateBudget();
         //6- Return the budget
         var budget = BudgetController.getBudget();

        //7- Display the budget on the UI
         UiCtrl.displayBudget(budget);

    };
    var updatePerecentage = function () {
        
        // 1- Calculate percentage
        BudgetCtrl.calculatePercentage();

        // 2- Read the percentage from the budget controller

        var percentages = BudgetCtrl.getPercentage();

        // 3- Update the UI of the new percentage
        UiCtrl.displayPercentage(percentages);
    }

    //Creating a function to control the actions takes when the button got clicked by the user or enter key got pressed by the user 
    var CtrlAddItem = function () {
        var input , newItem;
        
        
        //1- Get the filled input data by creating an instance of getInput function that we created in the UI controller
        input = UiCtrl.getInput();

        //To prevent empty input fields we will frist check if the descreption field is empty or the value field is NAN or 0
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

        //2- Add the item to the budget controller
        newItem = BudgetController.addItem(input.type, input.description,input.value);

        //3- Add the item to the UI
        UiCtrl.addListItem(newItem, input.type);

        //4- Clear the fields after adding the item from the UI
        UiCtrl.clearFields();
        
        //8- Calculate and update budget
         updateBudget();

        // 9- Caclulate and update percentage
        updatePerecentage();
        }
       
       

    }
    //Creating a function to control the actions takes when the delete button got clicked by the user or enter key got pressed by the user  
    // We add the event here becuase we need to know what the target element is because in event delegation and event bubbles up and then we can know where it's came from by looking at the target property of the event
    var CtrlDeleteItem = function (event) {
        var itemId , splitID , type ,ID;
        //Here we use the event to specefic the target element we clicked on and then we jump to the parent of the element four time because in our case the delete icon have four up steps to reach the main parent element in our case inc-0 inc-1 etc.. or exp-0 exp-1 etc.. so to grape the id we use .id
       itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //If the item id has a value simply will do this steps to separate the type from the name
       if (itemId) {
           //So if we have inc-0 after spliting with - as a separator we will have an array with [inc][0]
        splitID = itemId.split("-");
          //Now let's get the type and the id from the generated splitID array
          type = splitID[0];
          // We conver the id from string to int using pase int method because delete item function take an integer id
          ID = parseInt(splitID[1]);



        // 1- delete the item from the data structure
        BudgetCtrl.deleteItem(type , ID);

        // 2- delete the item from the UI
        UiCtrl.deleteItem(itemId);

        // 3- Update and show the new budget
        updateBudget();

        // 4- Calculate and update new percentage
        updatePerecentage();

       }
    };
    //Now our event listeners is private so to make it public we will return it in an property function called init because this will be the first part we want to be start in the code 
    return {
        init: function () {
        console.log("the application is started")
        // Call the date function to display the date at the start of the page
        UiCtrl.displayDate();
        //We call display budget method from the UI controller and initialize all the values in the object to start a new calculation
        UiCtrl.displayBudget( {
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
            }

        );
         setupEventListeners();
        }
    }


})(BudgetController , UIController);


// this is the only line that will be outside the controllers because we want it to be the first thing to work in the application to initialize all the data and get it because without data will be there is no application
Controller.init();