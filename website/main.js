// Contant variables
var saved_categories = {};

// Main parameters of the module
const CATEGORIES = {
  "History": [
    '🐊 A young and curious adventurer',
    '🧙‍♂️ A skilled mage with a troubled past',
    '👩‍🎨 A cunning thief seeking redemption',
    '🥷 An honorable knight on a quest',
    '😵‍💫 A wise and ancient forest spirit',
    '🧳 A lost traveler from another realm',
  ],
  "trait": [
    "💪 Strength: Allows the character to overcome physical obstacles or engage in combat",
    "🧠 Intelligence: Helps the character solve puzzles and decipher complex riddles",
    "🏃‍♀️ Agility: Enables the character to navigate treacherous terrain or evade danger",
    "💄 Charm: Allows the character to persuade or manipulate NPCs",
    "👀 Perception: Helps the character notice hidden clues or detect hidden dangers",
    "🪄 Magic: Grants the character access to powerful spells and abilities",
  ],
  "location": [
    "🕍 An ancient temple hidden deep within the forest",
    "🏙️ A mystical village populated by magical creatures",
    "⛰️ A dark and treacherous swamp filled with dangerous creatures",
    "💦 A towering waterfall cascading into a hidden cavern",
    "📚 A forgotten library guarded by enchanted books",
    "🏡 A mystical garden blooming with rare and powerful herbs",
  ],
  "goal": [
    "🔍 Find a way to break a powerful curse",
    "🔮 Uncover the truth behind a mysterious prophecy",
    "🏆 Retrieve a stolen artifact of immense power",
    "⚖️ Restore balance to the enchanted forest",
    "🌐 Discover the source of a spreading corruption",
    "💖 Save a captured loved one from an evil sorcerer",
  ],
  "item": [
    "🔑 A rusty key with an unknown purpose",
    "🗺️ A worn-out map with cryptic symbols",
    "💍 A magical pendant that glows faintly",
    "💼 A small satchel of healing herbs and potions",
    "📩 A mysterious letter with a hidden message",
    "🗡️ A silver dagger with intricate engravings",
  ]
};


// Additional Style categories
const Style_CATEGORIES = {
  "Style": [
    '🧙‍♂️ Fantasy',
    '🏰 Medieval',
    '🌌 Sci-Fi',
    '🌿 Nature',
    '🏙️ Urban',
  ],
  "Color": [
    '🔴 Red',
    '🟠 Orange',
    '🟡 Yellow',
    '🟢 Green',
    '🔵 Blue',
    '🟣 Purple',
  ],
  "Shape": [
    '⚪ Circle',
    '⬜ Square',
    '🔺 Triangle',
    '🔻 Diamond',
    '🔘 Rectangle',
    '🔳 Hexagon',
  ],
  "Character": [
    '👑 King',
    '👸 Queen',
    '🧚 Fairy',
    '🧟 Zombie',
    '🦄 Unicorn',
    '🐉 Dragon',
  ],
  "Background": [
    '🌅 Sunset',
    '🏞️ Mountains',
    '🌊 Ocean',
    '🌆 Cityscape',
    '🌌 Galaxy',
    '🏝️ Beach',
  ],
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

  // Create the outer bubble and set bootstrap classes
  let userMessageBubble = document.createElement("div");
  userMessageBubble.setAttribute("class", "w-100 d-flex justify-content-end");

  // Create the inner text and set bootstrap classes
  let userMessageText = document.createElement("div");
  userMessageText.setAttribute("class", "w-75 alert alert-success");
  userMessageText.setAttribute("role", "alert");
  userMessageText.textContent = message;

  // Add the text to the bubble and append the bubble to the chat
  userMessageBubble.appendChild(userMessageText);
  document.getElementById("main-chat").appendChild(userMessageBubble);

  // Scroll to the bottom of the chat
  scrollLast();
}

// Function to add an AI message to the chat
function addAIMessage(message) {

  // Create the outer bubble and set bootstrap classes
  let aiMessageBubble = document.createElement("div");
  aiMessageBubble.setAttribute("class", "w-100 d-flex justify-content-start");

  // Create the inner text and set bootstrap classes
  let aiMessageText = document.createElement("div");
  aiMessageText.setAttribute("class", "w-75 alert alert-info");
  aiMessageText.setAttribute("role", "alert");
  aiMessageText.textContent = message;

  // Scroll to the bottom of the chat
  scrollLast();

  // Add the text to the bubble and append the bubble to the chat
  aiMessageBubble.appendChild(aiMessageText);
  document.getElementById("main-chat").appendChild(aiMessageBubble);
}

// Function to add a message selection modal in bootstrap
function addPreparedMessageSelector(options, callback) {
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
      // simulateAIResponse(selectedOption); // Simulate AI response after option selection
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

// Function to handle the user message submission 
function submitUserMessage(event) {

  // Get the user message from the input field
  var userMessage = document.querySelector("#chat-input").value;

  // if the user message is empty, do nothing
  if (userMessage === "") {
    return;
  }

  // Add the user message to the chat
  addUserMessage(userMessage);

  // Senc the user message to the AI
  sendUserMessageToAI(userMessage);

  // Clear the chat input field 
  document.querySelector("#chat-input").value = "";

};

function addAllEventListeners() {

  // Event listener for the clicking the "Submit message" button
  document.querySelector("#chat-submission-button").addEventListener("click", submitUserMessage);

  // Event listener for pressing Enter key in the input field
  document.querySelector("#chat-input").addEventListener("keypress", function (e) {
    // check that it was the enter key that was pressed
    if (e.key === 'Enter') {
      submitUserMessage(e);
    }
  }
  ); 
  
}


// Generate categories and handlers
function generateCategoriesAndHandlers() {
  var root_elem = $("#list-parameters");

  // Generate all the inputs from the CATEGORIES constant
  Object.entries(CATEGORIES).forEach(function ([category, items]) {
    var categoryLine = $('<div class="w-100 d-flex justify-content-start"></div>');
    var categoryTitle = $('<div class="w-25">' + toTitleCase(category) + ':</div>');
    categoryTitle.appendTo(categoryLine);

    var selectGroup = $('<div class="form-group w-75 mb-2"></div>');
    var selectElem = $('<select class="form-control"></select>');
    selectElem.attr('id', category);

    for (var i = 0; i < items.length; i++) {
      var option = $('<option value="' + items[i] + '">' + items[i] + '</option>');
      option.appendTo(selectElem);
    }

    selectElem.appendTo(selectGroup);
    selectGroup.appendTo(categoryLine);
    categoryLine.appendTo(root_elem);
  });

  // Generate all the inputs from the Style_CATEGORIES constant
  Object.entries(Style_CATEGORIES).forEach(function ([category, items]) {
    var categoryLine = $('<div class="w-100 d-flex justify-content-start"></div>');
    var categoryTitle = $('<div class="w-25">' + toTitleCase(category) + ':</div>');
    categoryTitle.appendTo(categoryLine);

    var selectGroup = $('<div class="form-group w-75 mb-2"></div>');
    var selectElem = $('<select class="form-control"></select>');
    selectElem.attr('id', category);

    for (var i = 0; i < items.length; i++) {
      var option = $('<option value="' + items[i] + '">' + items[i] + '</option>');
      option.appendTo(selectElem);
    }

    selectElem.appendTo(selectGroup);
    selectGroup.appendTo(categoryLine);
    categoryLine.appendTo(root_elem);
  });

  // Create the categories-wide validation button
  var validation_button = $('<form class="w-100 form-inline d-flex justify-content-center">' +
    '<button type="submit" class="btn btn-primary">Confirm parameters</button>' +
    '</form>');
  validation_button.submit(handleCategorySubmission);
  validation_button.appendTo(root_elem);

  // Local function to handle the category submission
  async function handleCategorySubmission(event) {
    event.preventDefault();

    var selects = root_elem.find('select');

    for (var i = 0; i < selects.length; i++) {
      var select_id = $(selects[i]).attr("id");
      var selectedOption = $(selects[i]).val();

      if (selectedOption === null) {
        createModal(
          "Error",
          'Category "' + select_id + '" has no selected option.'
        );
        return;
      }

      saved_categories[select_id] = selectedOption;
    }

    // Disable all elements
    for (var i = 0; i < selects.length; i++) {
      $(selects[i]).prop("disabled", true);
    }

    // Remove validation button
    validation_button.remove();

    // Generate AI message with selected parameters
    var selectedParameters = [];
    Object.entries(saved_categories).forEach(function ([category, value]) {
      selectedParameters.push(value);
    });

    sysMsgPromptFmtr = {
      background: selectedParameters[0],
      trait: selectedParameters[1],
      location: selectedParameters[2],
      goal: selectedParameters[3],
      item: selectedParameters[4],
    };

    // get game update obj from fastapi python server
    let endpoint = "http://127.0.0.1:8000/game/start"

    gameUpdatePromise = await fetch(endpoint, {
      method: 'POST',
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Methods': '*',

        'Origin': 'http://jwalk.io'
      },
      body: JSON.stringify(sysMsgPromptFmtr)
    });

    const gameUpdate = await gameUpdatePromise.json();

    var aiMessage = gameUpdate.player_message
    var aiOptions = gameUpdate.action_options

    updateHealthBar(gameUpdate.player_stats[0]);
    updateEnergyBar(gameUpdate.player_stats[1]);
    updateMoneyBar(gameUpdate.player_stats[2]);

    addAIMessage(aiMessage)
    
    preparedMessageCallback = function (aiOption) {
      submitUserMessage(aiOption); // Submit the AI's selected option to the API
      addUserMessage(aiOption); // Add the AI's selected option as a user message
      $("#chat-submission-button").click(); // Trigger the button click to submit the AI's selected option
    }

    // Generate message selection modal
    addPreparedMessageSelector(aiOptions, preparedMessageCallback);
  }

  function updateHealthBar(health) {
    var healthBar = $("#healthbar");
    healthBar.css("width", health + "%");
  }

  function updateEnergyBar(energy) {
    var energyBar = $("#energybar");
    energyBar.css("width", energy + "%");
  }

  function updateMoneyBar(money) {
    var moneyBar = $("#moneybar");
    moneyBar.css("width", money + "%");
  }

  // Function to convert a string to title case
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

addAllEventListeners();
generateCategoriesAndHandlers();