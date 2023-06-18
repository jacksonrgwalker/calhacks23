// Contant variables
// Please keep following at the top
var saved_categories = {};

// Main parameters of the module
// Please also keep at the top
const CATEGORIES = {
  "Character": [
    'A young and curious adventurer',
    'A skilled mage with a troubled past',
    'A cunning thief seeking redemption',
    'An honorable knight on a quest',
    'A wise and ancient forest spirit',
    'A lost traveler from another realm',
    'Free Input',
  ],
  "Main trait": [
    "Strength: Allows the character to overcome physical obstacles or engage in combat",
    "Intelligence: Helps the character solve puzzles and decipher complex riddles",
    "Agility: Enables the character to navigate treacherous terrain or evade danger",
    "Charm: Allows the character to persuade or manipulate NPCs",
    "Perception: Helps the character notice hidden clues or detect hidden dangers",
    "Magic: Grants the character access to powerful spells and abilities",
  ],
  "Location": [
    "An ancient temple hidden deep within the forest",
    "A mystical village populated by magical creatures",
    "A dark and treacherous swamp filled with dangerous creatures",
    "A towering waterfall cascading into a hidden cavern",
    "A forgotten library guarded by enchanted books",
    "A mystical garden blooming with rare and powerful herbs",
  ],
  "Goal of the character": [
    "Find a way to break a powerful curse",
    "Uncover the truth behind a mysterious prophecy",
    "Retrieve a stolen artifact of immense power",
    "Restore balance to the enchanted forest",
    "Discover the source of a spreading corruption",
    "Save a captured loved one from an evil sorcerer",
  ],
  "Item to start": [
    "A rusty key with an unknown purpose",
    "A worn-out map with cryptic symbols",
    "A magical pendant that glows faintly",
    "A small satchel of healing herbs and potions",
    "A mysterious letter with a hidden message",
    "A silver dagger with intricate engravings",
  ],
  "Story": [
    "Strength: Allows the character to overcome physical obstacles or engage in combat",
    "Intelligence: Helps the character solve puzzles and decipher complex riddles",
    "Agility: Enables the character to navigate treacherous terrain or evade danger",
    "Charm: Allows the character to persuade or manipulate NPCs",
    "Perception: Helps the character notice hidden clues or detect hidden dangers",
    "Magic: Grants the character access to powerful spells and abilities",
  ]
}

/// Helper function to replace vars into a string
String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function (match, index) {
    return typeof args[index] !== 'undefined' ? args[index] : match;
  });
};

// Helper function to generate a modal 
// Params: title (str) and content (str)
function createModal(title, content) {
  var modaL_template = `
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
    `
  var modal = $(modaL_template.format(title, content))
  modal.modal('show');
  modal.appendTo($(document));
}

// Helper function to generate categories and add the handler
function generateCategoriesAndHandlers() {
  // All templates needed by the function
  // Main placeholder of a category
  const category_template =
    `<div class="card w-50">
    <div class="card-header">{0}</div>
    <div class="card-body">
        <form type="radio" id={0}>
        </form>
    </div>
  </div>`
  // Element for a category
  const category_element_template = `
  <div class="form-check">
    <label class="form-check-label" for="exampleRadios{0}">
      <input class="form-check-input" type="radio" name="exampleRadios"
        id="exampleRadios{0}">
      <text>{1}<text/>
    </label>
  </div>`
  // Categories-common validation button
  const validation_category_template = `
  <form class="w-100 form-inline d-flex justify-content-center">
    <button type="submit preferences" class="btn btn-primary mb-2">
      Confirm parameters
    </button>
  </form>`

  // Root element for all the categories
  var root_elem = $("#list-parameters");

  // Generate all the inputs from the CATEGORIES constant
  let count = 0;
  Object.entries(CATEGORIES).forEach(function ([category, items]) {
    var parent_elem = $(category_template.format(category));
    var form_elem = parent_elem.find("form");

    for (var i = 0; i < items.length; i++) {
      var element = $(category_element_template.format(count++, items[i]));
      element.appendTo(form_elem);
    }
    parent_elem.appendTo(root_elem);
  });

  // Create the categories wide validation button
  validation_button = $(validation_category_template);
  validation_button.appendTo("#list-parameters");

  // Scroll to the top after adding the elements
  $("#list-parameters-data-spy").animate({ scrollTop: 0 });

  // Local function to handle a click on the button
  function handleClick() {
    // Prevent default behavior
    event.preventDefault();

    var radios = root_elem.find('form[type=radio]');

    for (var i = 0; i < radios.length; i++) {
      // Get the name of the category
      var radio_id = $(radios[i]).attr("id");

      // Selected all checked inputs
      var inputs = $(radios[i]).find("input[type=radio]");
      inputs = inputs.filter(":checked");

      if (inputs.length == 0) {
        // ERROR: Generate corresponding modal
        createModal(
          title = "Error",
          content = "Category ``{0}`` has no checked element".format(radio_id),
        );
        return;
      }

      // There can only be one checked element
      // Recover the text from this element
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

    // Remove validation buttion
    validation_button.remove();
  };

  validation_button.click(handleClick);
}

$(document).ready(function () {
  generateCategoriesAndHandlers();
});