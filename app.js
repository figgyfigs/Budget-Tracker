///////////////////////////////////////////////////////////////////////////////
//////////////////////////// Budget Controller
var budgetController = (function() {


}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////// UI Controller
var UIController = (function() {

	var DOMstrings = {

		inputType: '.add__type',
		inputDescription: 'add__description',
	}
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
