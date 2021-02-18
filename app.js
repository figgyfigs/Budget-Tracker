// BUDGET CONTROLLER
var budget_controller = (function() {
    
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  
  
  Expense.prototype.calc_percentage = function(total_income) {
    if (total_income > 0) {
      this.percentage = Math.round((this.value / total_income) * 100);
    } else {
        this.percentage = -1;
      }
  };
  
  
  Expense.prototype.get_percentage = function() {
    return this.percentage;
  };
  
  
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  

  var calculate_total = function(type) {
    var sum = 0;
    data.all_items[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  
  
  var data = {
    all_items: { exp: [], inc: [] },
    totals: { exp: 0, inc: 0 },
    budget: 0,
    percentage: -1
  };
  
  
  return {
    
    add_item: function(type, des, val) {
      var new_item, ID;
          
        // Create new ID
      if (data.all_items[type].length > 0) {
        ID = data.all_items[type][data.all_items[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
//stop here
          // Create new item based on 'inc' or 'exp' type
          if (type === 'exp') {
              new_item = new Expense(ID, des, val);
          } else if (type === 'inc') {
              new_item = new Income(ID, des, val);
          }
          
          // Push it into our data structure
          data.all_items[type].push(new_item);
          
          // Return the new element
          return new_item;
      },
      
      
      delete_item: function(type, id) {
          var ids, index;
 
          ids = data.all_items[type].map(function(current) {
              return current.id;
          });

          index = ids.indexOf(id);

          if (index !== -1) {
              data.all_items[type].splice(index, 1);
          }
          
      },
      
      
      calculate_budget: function() {
          
          // calculate total income and expenses
          calculate_total('exp');
          calculate_total('inc');
          
          // Calculate the budget: income - expenses
          data.budget = data.totals.inc - data.totals.exp;
          
          // calculate the percentage of income that we spent
          if (data.totals.inc > 0) {
              data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
          } else {
              data.percentage = -1;
          }            
          
          // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
      },
      
      calculate_percentages: function() {
          
          data.all_items.exp.forEach(function(cur) {
             cur.calc_percentage(data.totals.inc);
          });
      },
      
      
      get_percentages: function() {
          var allPerc = data.all_items.exp.map(function(cur) {
              return cur.get_percentage();
          });
          return allPerc;
      },
      
      
      get_budget: function() {
          return {
              budget: data.budget,
              total_inc: data.totals.inc,
              total_exp: data.totals.exp,
              percentage: data.percentage
          };
      },
      
      testing: function() {
          console.log(data);
      }
  };
  
})();




// UI CONTROLLER
var ui_controller = (function() {
  
  var DOM_strings = {
      input_type: '.add-type',
      input_description: '.add-description',
      input_value: '.add-value',
      input_btn: '.add-btn',
      income_container: '.income-list',
      expenses_container: '.expenses-list',
      budget_label: '.budget-value',
      income_label: '.budget-income-value',
      expenses_label: '.budget-expenses-value',
      percentage_label: '.budget-expenses-percentage',
      container: '.container',
      expenses_perc_label: '.item-percentage',
      date_label: '.budget-title-month'
  };
  
    /*
      1210.3867 -> + 1,210.39
    */
  var format_number = function(num, type) {
      var number_split, int, dec, type;
    
      num = Math.abs(num);
      num = num.toFixed(2);

      number_split = num.split('.');

      int = number_split[0];
      if (int.length > 3) {
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
      }

      dec = number_split[1];

      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };
  
  
  var each_node = function(list, callback) {
      for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
      }
  };
  
  
  return {
      get_input: function() {
          return {
              type: document.querySelector(DOM_strings.input_type).value,
              description: document.querySelector(DOM_strings.input_description).value,
              value: parseFloat(document.querySelector(DOM_strings.input_value).value)
          };
      },
      
      
      add_list_item: function(obj, type) {
          var html, add_html, element;
          // Create HTML string with placeholder text
          
          if (type === 'inc') {
              element = DOM_strings.income_container;
              
              html = '<div class="item clearfix" id="inc-%id%"> <div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          } else if (type === 'exp') {
              element = DOM_strings.expenses_container;
              
              html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }
          
          // Replace the placeholder text with some actual data
          add_html = html.replace('%id%', obj.id);
          add_html = add_html.replace('%description%', obj.description);
          add_html = add_html.replace('%value%', format_number(obj.value, type));
          
          // Insert the HTML into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', add_html);
      },
      
      
      delete_list_item: function(selector_ID) {
          
          var el = document.getElementById(selector_ID);
          el.parentNode.removeChild(el);
          
      },
      
      
      clear_fields: function() {
          var fields, fieldsArr;
          
          fields = document.querySelectorAll(DOM_strings.input_description + ', ' + DOM_strings.input_value);
          
          fieldsArr = Array.prototype.slice.call(fields);
          
          fieldsArr.forEach(function(current, index, array) {
              current.value = "";
          });
          
          fieldsArr[0].focus();
      },
      
      
      show_budget: function(obj) {
          var type;
          obj.budget > 0 ? type = 'inc' : type = 'exp';
          
          document.querySelector(DOM_strings.budget_label).textContent = format_number(obj.budget, type);
          document.querySelector(DOM_strings.income_label).textContent = format_number(obj.total_inc, 'inc');
          document.querySelector(DOM_strings.expenses_label).textContent = format_number(obj.total_exp, 'exp');
          
          if (obj.percentage > 0) {
              document.querySelector(DOM_strings.percentage_label).textContent = obj.percentage + '%';
          } else {
              document.querySelector(DOM_strings.percentage_label).textContent = '---';
          }
          
      },
      
      
      show_percentages: function(percentages) {
          
          var fields = document.querySelectorAll(DOM_strings.expenses_perc_label);
          
          each_node(fields, function(current, index) {
              
              if (percentages[index] > 0) {
                  current.textContent = percentages[index] + '%';
              } else {
                  current.textContent = '---';
              }
          });
          
      },
      
      
      show_month: function() {
          var now, months, month, year;
          
          now = new Date();
          //var christmas = new Date(2016, 11, 25);
          
          months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          month = now.getMonth();
          
          year = now.getFullYear();
          document.querySelector(DOM_strings.date_label).textContent = months[month] + ' ' + year;
      },
      
      
      changed_type: function() {
          
          var fields = document.querySelectorAll(
              DOM_strings.input_type + ',' +
              DOM_strings.input_description + ',' +
              DOM_strings.input_value);
          
          each_node(fields, function(cur) {
             cur.classList.toggle('red-focus'); 
          });
          
          document.querySelector(DOM_strings.input_btn).classList.toggle('red');
          
      },
      
      get_DOM_strings: function() {
          return DOM_strings;
      }
  };
  
})();




// GLOBAL APP CONTROLLER
var controller = (function(budget_ctrl, UI_ctrl) {
  
  var setupEventListeners = function() {
      var DOM = UI_ctrl.get_DOM_strings();
      
      document.querySelector(DOM.input_btn).addEventListener('click', ctrl_add_item);

      document.addEventListener('keypress', function(event) {
          if (event.keyCode === 13 || event.which === 13) {
              ctrl_add_item();
          }
      });
      
      document.querySelector(DOM.container).addEventListener('click', ctrl_delete_item);
      
      document.querySelector(DOM.input_type).addEventListener('change', UI_ctrl.changed_type);        
  };
  
  
  var update_budget = function() {
      
      // 1. Calculate the budget
      budget_ctrl.calculate_budget();
      
      // 2. Return the budget
      var budget = budget_ctrl.get_budget();
      
      // 3. Display the budget on the UI
      UI_ctrl.show_budget(budget);
  };
  
  
  var update_percentages = function() {
      
      // 1. Calculate percentages
      budget_ctrl.calculate_percentages();
      
      // 2. Read percentages from the budget controller
      var percentages = budget_ctrl.get_percentages();
      
      // 3. Update the UI with the new percentages
      UI_ctrl.show_percentages(percentages);
  };
  
  
  var ctrl_add_item = function() {
      var input, new_item;
      
      // 1. Get the field input data
      input = UI_ctrl.get_input();        
      
      if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
          // 2. Add the item to the budget controller
          new_item = budget_ctrl.add_item(input.type, input.description, input.value);

          // 3. Add the item to the UI
          UI_ctrl.add_list_item(new_item, input.type);

          // 4. Clear the fields
          UI_ctrl.clear_fields();

          // 5. Calculate and update budget
          update_budget();
          
          // 6. Calculate and update percentages
          update_percentages();
      }
  };
  
  
  var ctrl_delete_item = function(event) {
      var item_id, split_id, type, ID;
      
      item_id = event.target.parentNode.parentNode.parentNode.parentNode.id;
      
      if (item_id) {
          
          //inc-1
          split_id = item_id.split('-');
          type = split_id[0];
          ID = parseInt(split_id[1]);
          
          // 1. delete the item from the data structure
          budget_ctrl.delete_item(type, ID);
          
          // 2. Delete the item from the UI
          UI_ctrl.delete_list_item(item_id);
          
          // 3. Update and show the new budget
          update_budget();
          
          // 4. Calculate and update percentages
          update_percentages();
      }
  };
  
  
  return {
      init: function() {
          console.log('Application has started.');
          UI_ctrl.show_month();
          UI_ctrl.show_budget({
              budget: 0,
              total_inc: 0,
              total_exp: 0,
              percentage: -1
          });
          setupEventListeners();
      }
  };
  
})(budget_controller, ui_controller);


controller.init();