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

