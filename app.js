///////////////////////////////////////////////////////////////////////////////
//////////////////////////// Budget Controller
var budgetController = (function() {

	var Expense = function(id, description, value) {

    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {

    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

	Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {

    this.id = id;
    this.description = description;
    this.value = value;
  };

	var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });

    data.totals[type] = sum;

  };

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

  };

	return {

    calculateBudget: function() {

      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if(data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },

    calculatePercentages: function() {

      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },


}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////// UI Controller
var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensePercentLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(number, type) {
    var numberSplit, int, dec, type;

    number = Math.abs(number);
    number = number.toFixed(2); //returns a string 2 -> 2.00

    numberSplit = number.split('.'); //returns an array of the split

    int = numberSplit[0];

    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numberSplit[1];

    type === 'exp' ? sign = '-' : sign = '+';

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };

  var nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };


}


////////////////////////////////////////////////////////////////////
////////////////Global App Controller
var Controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {

			var DOM = UICtrl.getDOMStrings();

			document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

			document.addEventListener('keypress', function(event) {
					if(event.keycode === 13 || event.which === 13) {
						ctrlAddItem();
					}
			});

			document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

      document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

		};


		var updateBudget = function() {

	    //input = UICtrl.getInput();
	    //      1. Calculate the budget
	    budgetCtrl.calculateBudget();

	    //      2. return the budget
	    var budget = budgetCtrl.getBudget();

	    //      3. Display the budget on the UI
	    UICtrl.displayBudget(budget);

	  };

	  var updatePercentages = function() {

	    // 1. calculate percentages
	    budgetCtrl.calculatePercentages();


	   	// 2. read percentages from the budget controller
	   	var percentages = budgetCtrl.getPercentages();


	   	// 3. update the UI with the new percentages
	   	UICtrl.displayPercentages(percentages);

	};


  var ctrlAddItem = function() {

      var input, newItem;
    // TODO:
    //      1. Get the field input data
      input = UICtrl.getInput();

      if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
    //      2. Add the item to the budget Controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //      3. Add the new item to the UI
      UICtrl.addListItem(newItem, input.type);
    //      4. Clear the fields
      UICtrl.clearFields();
    //      5. Calculate and update budget
      updateBudget();

    //      6. Calculate and update percentages
      updatePercentages();

      }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID) {

      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      id = parseInt(splitID[1]);

      //1. delete the item from the data structure
      budgetCtrl.deleteItem(type, id);

      //2. delete the item from the UI
      UICtrl.deleteListItem(itemID);
      //3. update and show the new budget
      updateBudget();

      //4. calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log('Application has started.');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,

      });

      setupEventListeners();
    }
  };

})(budgetController, UIController);

Controller.init();
