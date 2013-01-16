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
    jQuery(".form-search > button").click(function(e) {
        e.preventDefault();
        ajax_search(jQuery(".form-search > #appendedInputButton").val());
    });
    
    // Trigger live search when 3 or more characters have been typed.
    jQuery(".form-search > input[type=search]").keyup(function(e) {
        word = jQuery(".form-search > #appendedInputButton").val();
        if (word.length > 2) {
            ajax_search(word);
        }
        else if (!word) {
            // Cleanup the search results if the search field is blank.
            jQuery("#results-list").html("");
        };
    });
});
