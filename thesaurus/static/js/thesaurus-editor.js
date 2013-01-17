// Copyright 2013 Leandro Regueiro
// 
// This file is part of Thesaurus-editor.
// 
// Terminator is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Terminator is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Thesaurus-editor. If not see <http://www.gnu.org/licenses/>.


jQuery(document).ready(function () {
    // Enable tooltips.
    $("[rel=tooltip]").tooltip();
    
    // Put the focus on the search field when hitting the F key.
    jQuery(document).bind('keyup', 'f', function(event) {
        jQuery('.form-search > #appendedInputButton').focus();
    });
    
    // Get the search results and show them.
    function ajax_search(word) {
        if (word) {
            jQuery("#results-list").load("/search/?word=" + word);
            
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
            word = jQuery(".form-search > #appendedInputButton").val();
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
            previous = jQuery("#results-list > li.active")
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
            previous = jQuery("#results-list > li.active")
                .removeClass("active");
            // Hide previous active search result buttons.
            previous.find("div").addClass("hide");
            // Make active the previous search result and show its buttons.
            previous.prev("li").addClass("active").find("div")
                .removeClass("hide");
        };
    });
});
