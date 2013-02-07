// Copyright 2013 Leandro Regueiro
// 
// This file is part of Thesaurus-editor.
// 
// Thesaurus-editor is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
// 
// Thesaurus-editor is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
// or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
// 
// You should have received a copy of the GNU General Public License along with
// Thesaurus-editor. If not see <http://www.gnu.org/licenses/>.


jQuery(document).ready(function () {
    
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    
    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
            }
        }
    });
    
    // Put the focus on the search field when hitting the F key.
    jQuery(document).bind('keyup', 'f', function(event) {
        jQuery('.form-search > #appendedInputButton').focus();
    });
    
    // Get the search results and show them.
    function ajax_search(word) {
        if (word) {
            var url = "/search/?word=" + word + "&current=" +
                jQuery("#current-word").text().trim();
            jQuery("#results-list").load(url);
            
            // Enable tooltips again, since new buttons are loaded.
            $("[rel=tooltip]").tooltip();
        };
    }
    
    // Trigger search when hitting on the search form button.
    jQuery(".form-search > button").click(function(event) {
        event.preventDefault();
        ajax_search(jQuery(".form-search > #appendedInputButton").val());
    });
    
    // Run live search if any character is typed in the search field.
    jQuery(".form-search > input[type=search]").keyup(function(event) {
        // Key          Keycode
        // Tab          9
        // Enter        13
        // Shift        16
        // Ctrl         17
        // Alt          18
        // Caps-lock    20
        // Page Up      33
        // Page Down    34
        // End          35
        // Home         36
        // Left arrow   37
        // Up arrow     38
        // Right arrow  39
        // Down arrow   40
        
        // If the pressed key is not one of the shortcut keys. This check is
        // necessary since the this is called even when a non alphanumeric key
        // is pressed.
        if (event.which != 37 && event.which != 38 && event.which != 39 &&
                event.which != 40) {
            var word = jQuery(".form-search > #appendedInputButton").val();
            // Trigger live search when 3 or more characters have been typed.
            if (word.length > 2) {
                ajax_search(word);
            }
            else if (!word) {
                // Cleanup the search results if the search field is blank.
                jQuery("#results-list").html("");
            };
        };
    });
    
    // Move down in the results list when pressing the down key.
    jQuery(document).bind('keyup', 'down', function(event) {
        /* TODO avoid scrolling down the page when pressing the down key. Maybe
           this isn't a good idea, perhaps shift+down should be used instead.
        */
        
        // Get the focus out of the search field since now we are navigating
        // the search results.
        jQuery(".form-search > input[type=search]").blur();
        
        // Only trigger if the active row is not the last one in the results.
        if (jQuery("#results-list > li.active").is(":not(:last-child)")) {
            // Remove previous active search result its active status.
            var previous = jQuery("#results-list > li.active")
                .removeClass("active");
            // Hide previous active search result buttons.
            previous.find("div").addClass("hide");
            // Make active the next search result and show its buttons.
            previous.next("li").addClass("active").find("div")
                .removeClass("hide");
        };
    });
    
    // Move up in the results list when pressing the up key.
    jQuery(document).bind('keyup', 'up', function(event) {
        /* TODO avoid scrolling up the page when pressing the up key. Maybe
           this isn't a good idea, perhaps ctrl+up should be used instead.
        */
        
        // Get the focus out of the search field since now we are navigating
        // the search results.
        jQuery(".form-search > input[type=search]").blur();
        
        // Only trigger if the active row is not the first one in the results.
        if (jQuery("#results-list > li.active").is(":not(:first-child)")) {
            // Remove previous active search result its active status.
            var previous = jQuery("#results-list > li.active")
                .removeClass("active");
            // Hide previous active search result buttons.
            previous.find("div").addClass("hide");
            // Make active the previous search result and show its buttons.
            previous.prev("li").addClass("active").find("div")
                .removeClass("hide");
        };
    });
    
    // Add a new meaning with a new word.
    function add_new_meaning(type) {
        // Get the word in which entry are we working right now
        var current = jQuery("#current-word").text().trim();
        
        // Get the active word
        var new_word = jQuery("#results-list > li.active > a").contents()
            .first().text().trim();
        
        // Get the data
        var url = "/relationships/create/";
        // type can be "synonyms", "antonyms" or "hypernyms".
        var data = {
            current     : current,
            new_word    : new_word,
            type        : type
        };
        
        // Remove the selected-meaning class from all the meanings.
        jQuery("li.selected-meaning").removeClass("selected-meaning");
        
        // Create a new meaning for the current word adding the active word
        // in the meaning, and then refresh all the meanings for this type.
        jQuery("#" + type + " > ul.meanings").load(url, data);
    }
    
    // Add the active word from the search results list as new synonym in a new
    // synonym meaning using the keyboard.
    jQuery(document).bind('keyup', 's', function(event) {
        // If the focus is not in the search field.
        if (jQuery(".form-search > input[type=search]").is(":not(:focus)")) {
            add_new_meaning("synonyms");
        };
    });
    
    // Add the active word from the search results list as new antonym in a new
    // antonym meaning using the keyboard.
    jQuery(document).bind('keyup', 'a', function(event) {
        // If the focus is not in the search field.
        if (jQuery(".form-search > input[type=search]").is(":not(:focus)")) {
            add_new_meaning("antonyms");
        };
    });
    
    // Add the active word from the search results list as new hypernym in a
    // new hypernym meaning using the keyboard.
    jQuery(document).bind('keyup', 'r', function(event) {
        // If the focus is not in the search field.
        if (jQuery(".form-search > input[type=search]").is(":not(:focus)")) {
            add_new_meaning("hypernyms");
        };
    });
    
    // Add a new word in an existing meaning.
    function add_in_selected_meaning() {
        // Get the relationship type for selected meaning.
        var type = jQuery("li.selected-meaning").parent().parent().attr("id");
        
        // Get the word in which entry are we working right now.
        var current = jQuery("#current-word").text().trim();
        
        // Get the active word in search results.
        var new_word = jQuery("#results-list > li.active > a").contents()
            .first().text().trim();
        
        // Get the selected relationship id.
        var relationship = jQuery("li.selected-meaning").attr("id");
        
        // Get the data.
        var url = "/relationships/addword/";
        // type can be "synonyms", "antonyms" or "hypernym".
        var data = {
            current         : current,
            new_word        : new_word,
            relationship    : relationship,
            type            : type
        };
        
        // Create a new meaning for the current word adding the active word
        // in the meaning, and then refresh all the meanings for this type.
        jQuery("#" + type + " > ul.meanings").load(url, data);
    };
    
    // Add the active word from the search results list as a new word in the
    // currently selected meaning using the keyboard.
    jQuery(document).bind('keyup', 'c', function(event) {
        add_in_selected_meaning();
    });
    
    // Add the active word from the search results list as new synonym in a new
    // synonym meaning using the mouse.
    $(document).on("click", "#results-list button", function(event) {
        event.preventDefault();
        
        // Get the clicked button text.
        var target = jQuery(event.target).text().trim();
        
        switch (target) {
            case "S":
                add_new_meaning("synonyms");
                break;
            case "A":
                add_new_meaning("antonyms");
                break;
            case "R":
                add_new_meaning("hypernyms");
                break;
            case "C":
                add_in_selected_meaning();
                break;
        };
    });
    
    // Remove the word which delete button was pressed from the relationship.
    function remove_word(event) {
        // Get the clicked tag.
        var target = jQuery(event.target);
        
        // Get the word in which entry are we working right now.
        var current = jQuery("#current-word").text().trim();

        // Get the word to remove.
        var word = target.siblings("a").text().trim();

        // Get the relationship id where is the word to be removed.
        var relationship = target.parents(".meanings > li").attr("id");

        // Get the relationship type.
        var type = target.parents(".meanings").parent().attr("id");
        
        /* TODO Show a dialog to confirm if the word should be removed from the
           relationship.
        */
        
        // Get the data
        var url = "/relationships/removeword/";
        // type can be "synonyms", "antonyms" or "hypernym".
        var data = {
            current         : current,
            word            : word,
            relationship    : relationship,
            type            : type
        };
        
        // Remove the word from the relationship, deleting it if it has no more
        // words. After that reload the relationships list for this kind.
        jQuery("#" + type + " > ul.meanings").load(url, data);
    }
    
    // Remove the word which delete button was pressed from the relationship.
    $(document).on("click", ".meanings span.word i.icon-trash", remove_word);
    
    // Select the next meaning, independently of the relationship type, if it
    // is not the last meaning, or the first meaning if no meaning is selected,
    // using the keyboard.
    jQuery(document).bind('keyup', 'ctrl+down', function(event) {
        var current = jQuery("#relationships li.selected-meaning");
        
        if (current.length == 0) {
            jQuery("#relationships li[id]:first").addClass("selected-meaning");
        }
        else {
            // Get all the meanings (li with id attribute).
            var meanings = jQuery("#relationships li[id]").toArray();
            var found = false;
            
            for (var i = 0; i < meanings.length; i++) {
                if (found) {
                    found = false;
                    current.removeClass("selected-meaning");
                    jQuery(meanings[i]).addClass("selected-meaning");
                    break;
                };
                
                if (current.attr("id") == jQuery(meanings[i]).attr("id")) {
                    found = true;
                };
            };
        };
    });
    
    // Select the previous meaning, independently of the relationship type, if
    // it is not the last meaning, or the last meaning if no meaning is
    // selected, using the keyboard.
    jQuery(document).bind('keyup', 'ctrl+up', function(event) {
        var current = jQuery("#relationships li.selected-meaning");
        
        if (current.length == 0) {
            jQuery("#relationships li[id]:last").addClass("selected-meaning");
        }
        else {
            // Get all the meanings (li with id attribute).
            var meanings = jQuery("#relationships li[id]").toArray();
            var found = false;
            
            for (var i = meanings.length - 1; i >= 0; i--) {
                if (found) {
                    found = false;
                    current.removeClass("selected-meaning");
                    jQuery(meanings[i]).addClass("selected-meaning");
                    break;
                };
                
                if (current.attr("id") == jQuery(meanings[i]).attr("id")) {
                    found = true;
                };
            };
        };
    });
    
    // Mark the current word as finalized.
    jQuery(document).bind('keyup', 'p', function(event) {
        // If the current word is not yet finalized then fire the AJAX request.
        if (!jQuery("#current-word").hasClass("finalized")) {
            // Get the word in which entry are we working right now.
            var current = jQuery("#current-word").text().trim();
            
            // Mark the current word as finalized. After that reload the word
            // details page.
            jQuery("body").load("/finalize/", {current : current});
        };
    });
    
    // Mark the current word as not finalized.
    jQuery(document).bind('keyup', 'u', function(event) {
        // If the current word is already finalized then fire the AJAX request.
        if (jQuery("#current-word").hasClass("finalized")) {
            // Get the word in which entry are we working right now.
            var current = jQuery("#current-word").text().trim();
            
            // Mark the current word as not finalized. After that reload the
            // word details page.
            jQuery("body").load("/unfinalize/", {current : current});
        };
    });
});
