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
    
    // Enable tooltips.
    $("[rel=tooltip]").tooltip();
    
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
           this isn't a good idea, perhaps ctrl+down should be used instead.
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
        // type can be "synonyms", "antonyms" or "related".
        var data = {
            current     : current,
            new_word    : new_word,
            type        : type
        };
        
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
    
    // Add the active word from the search results list as new related word in
    // a new related word meaning using the keyboard.
    jQuery(document).bind('keyup', 'r', function(event) {
        // If the focus is not in the search field.
        if (jQuery(".form-search > input[type=search]").is(":not(:focus)")) {
            add_new_meaning("related-words");
        };
    });
});
