// Contant variables
var saved_categories = {};

// Main parameters of the module
const CATEGORIES = {
  "History": [
    'A young and curious adventurer',
    'A skilled mage with a troubled past',
    'A cunning thief seeking redemption',
    'An honorable knight on a quest',
    'A wise and ancient forest spirit',
    'A lost traveler from another realm',
  ],
  "trait": [
    "Strength: Allows the character to overcome physical obstacles or engage in combat",
    "Intelligence: Helps the character solve puzzles and decipher complex riddles",
    "Agility: Enables the character to navigate treacherous terrain or evade danger",
    "Charm: Allows the character to persuade or manipulate NPCs",
    "Perception: Helps the character notice hidden clues or detect hidden dangers",
    "Magic: Grants the character access to powerful spells and abilities",
  ],
  "location": [
    "An ancient temple hidden deep within the forest",
    "A mystical village populated by magical creatures",
    "A dark and treacherous swamp filled with dangerous creatures",
    "A towering waterfall cascading into a hidden cavern",
    "A forgotten library guarded by enchanted books",
    "A mystical garden blooming with rare and powerful herbs",
  ],
  "goal": [
    "Find a way to break a powerful curse",
    "Uncover the truth behind a mysterious prophecy",
    "Retrieve a stolen artifact of immense power",
    "Restore balance to the enchanted forest",
    "Discover the source of a spreading corruption",
    "Save a captured loved one from an evil sorcerer",
  ],
  "item": [
    "A rusty key with an unknown purpose",
    "A worn-out map with cryptic symbols",
    "A magical pendant that glows faintly",
    "A small satchel of healing herbs and potions",
    "A mysterious letter with a hidden message",
    "A silver dagger with intricate engravings",
  ]
};

// Helper function to replace vars into a string
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function (match, index) {
    return typeof args[index] !== 'undefined' ? args[index] : match;
  });
};

// Helper function to generate a modal 
function createModal(title, content) {
  var modal_template = `
    <div class="modal fade" id="exampleModal" tabindex="1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {0}
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {1}
          </div>
        </div>
      </div>
    </div>
  `;
  var modal = $(modal_template.format(title, content));
  modal.modal('show');
  modal.appendTo($(document));
}

// Function to add a user message to the chat
function addUserMessage(message) {
  var userMessage = `<div class="w-100 d-flex justify-content-end"><div class="w-75 alert alert-success" role="alert">${message}</div></div>`;
  $("#main-chat").append(userMessage);
  scrollLast();
}

// Function to add an AI message to the chat
function addAIMessage(message, options, callback) {
  var aiMessage = `<div class="w-100 d-flex justify-content-start"><div class="w-75 alert alert-info" role="alert">${message}</div></div>`;
  $("#main-chat").append(aiMessage);
  scrollLast();

  // Generate message selection modal
  addAIMessageSelector(options, callback);
}

// Function to add a message selection modal in bootstrap
function addAIMessageSelector(options, callback) {
  var options_elem = $('<div class="w-100 d-flex justify-content-start"><div class="w-75 list-group"></div></div>');
  var options_elem_list = options_elem.find(".list-group");

  for (var i = 0; i < options.length; i++) {
    var button = $(`<button type="button" class="list-group-item list-group-item-action">${options[i]}</button>`);
    options_elem_list.append(button);

    button.click(function (event) {
      event.preventDefault();
      var selectedOption = $(this).text();
      options_elem.remove();
      callback(selectedOption); // Trigger the callback with the selected option
      simulateAIResponse(selectedOption); // Simulate AI response after option selection
    });
  }

  options_elem.appendTo($("#main-chat"));
  scrollLast();
}

// Function to scroll to the last element of the chat
function scrollLast() {
  var target = $("#main-chat");
  var scrollHeight = target.prop("scrollHeight");
  target.scrollTop(scrollHeight);
}

// Function to simulate AI response
function simulateAIResponse(option) {
  // Replace this with your actual AI response logic
  var aiMessage = "This is the AI's response to the selected option: " + option;
  var aiOptions = ["AI Option 1", "AI Option 2", "AI Option 3"]; // Replace with your actual AI options
  addAIMessage(aiMessage, aiOptions, function (aiOption) {
    addUserMessage(aiOption); // Add the AI's selected option as a user message
    $("#chat-submission-button").click(); // Trigger the button click to submit the AI's selected option
  });
}

$(document).ready(function () {
  // Event listener for the "Submit message" button
  $("#chat-submission-button").click(function (event) {
    event.preventDefault();
    var userMessage = $("#chat-input").val().trim();

    if (userMessage !== "") {
      addUserMessage(userMessage);
      $("#chat-input").val("");

      // Simulate AI response after a short delay
      setTimeout(function () {
        var aiMessage = "This is the AI's response to your message: " + userMessage;
        var options = ["Option 1", "Option 2", "Option 3"]; // Replace with your actual options

        addAIMessage(aiMessage, options, function (option) {
          addUserMessage(option); // Add the selected option as a user message
          $("#chat-submission-button").click(); // Trigger the button click to submit the selected option
        });
      }, 1000);
    }
  });

  // Event listener for pressing Enter key in the input field
  $("#chat-input").keypress(function (event) {
    if (event.which === 13) {
      event.preventDefault();
      $("#chat-submission-button").click();
    }
  });

  // Toggle sidebar
  $("#toggle-sidebar").click(function (event) {
    event.preventDefault();
    $("#sidebar").toggleClass("active");
  });

  // Clear chat
  $("#clear-chat").click(function (event) {
    event.preventDefault();
    $("#main-chat").empty();
  });
});

// Generate categories and handlers
function generateCategoriesAndHandlers() {
  var root_elem = $("#list-parameters");

  // Generate all the inputs from the CATEGORIES constant
  let count = 0;
  Object.entries(CATEGORIES).forEach(function ([category, items]) {
    var parent_elem = $(`<div class="card w-50">
                            <div class="card-header">${toTitleCase(category)}</div>
                            <div class="card-body">
                              <form type="radio" id="${category}"></form>
                            </div>
                          </div>`);
    var form_elem = parent_elem.find("form");

    for (var i = 0; i < items.length; i++) {
      var element = $(`<div class="form-check">
                          <label class="form-check-label" for="exampleRadios${count}">
                            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios${count}">
                            <text>${items[i]}</text>
                          </label>
                        </div>`);
      element.appendTo(form_elem);
      count++;
    }
    parent_elem.appendTo(root_elem);
  });

  // Create the categories-wide validation button
  var validation_button = $(`<form class="w-100 form-inline d-flex justify-content-center">
                              <button type="submit" class="btn btn-primary mb-2">
                                Confirm parameters
                              </button>
                            </form>`);
  validation_button.submit(handleCategorySubmission);
  validation_button.appendTo(root_elem);

  // Local function to handle the category submission
  function handleCategorySubmission(event) {
    event.preventDefault();

    var radios = root_elem.find('form[type=radio]');

    for (var i = 0; i < radios.length; i++) {
      var radio_id = $(radios[i]).attr("id");
      var inputs = $(radios[i]).find("input[type=radio]");
      inputs = inputs.filter(":checked");

      if (inputs.length === 0) {
        createModal(
          "Error",
          `Category "${radio_id}" has no checked element.`
        );
        return;
      }

      var value = $(inputs[0]).parent().find("text").text();
      saved_categories[radio_id] = value;
    }

    // Disable all elements
    for (var i = 0; i < radios.length; i++) {
      var inputs = $(radios[i]).find("input[type=radio]");
      for (var j = 0; j < inputs.length; j++) {
        $(inputs[j]).prop("disabled", true);
      }
    }

    // Remove validation button
    validation_button.remove();

    // Generate AI message with selected parameters
    var selectedParameters = [];
    Object.entries(saved_categories).forEach(function ([category, value]) {
      selectedParameters.push(value);
    });
    var aiMessage = "You have selected the following parameters: " + selectedParameters.join(", ");
    var aiOptions = ["AI Option 1", "AI Option 2", "AI Option 3"]; // Replace with your actual AI options
    addAIMessage(aiMessage, aiOptions, function (aiOption) {
      addUserMessage(aiOption); // Add the AI's selected option as a user message
      $("#chat-submission-button").click(); // Trigger the button click to submit the AI's selected option
    });
  }

  // Function to convert a string to title case
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

generateCategoriesAndHandlers();
