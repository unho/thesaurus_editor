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
    
    // Enable tooltips.
    $("[rel=tooltip]").tooltip();
    
    // Go to word list when hitting Home key.
    jQuery(document).bind('keyup', 'home', function(event) {
        window.location.href = "/";
    });
    
    // Go to the import page when hitting I (and not having the focus on the
    // search field).
    jQuery(document).bind('keyup', 'i', function(event) {
        // If this is the word details page.
        var search_field = jQuery(".form-search > input[type=search]");
        if (search_field.length > 0) {
            // If the focus is not in the search field.
            if (search_field.is(":not(:focus)")) {
                window.location.href = jQuery(".icon-upload").parent()
                    .attr("href");
            };
        }
        else {
            window.location.href = jQuery(".icon-upload").parent()
                .attr("href");
        };
    });
    
    // Go to the help page when hitting H (and not having the focus on the
    // search field).
    jQuery(document).bind('keyup', 'h', function(event) {
        // If this is the word details page.
        var search_field = jQuery(".form-search > input[type=search]");
        if (search_field.length > 0) {
            // If the focus is not in the search field.
            if (search_field.is(":not(:focus)")) {
                window.location.href = jQuery(".icon-info-sign").parent()
                    .attr("href");
            };
        }
        else {
            window.location.href = jQuery(".icon-info-sign").parent()
                .attr("href");
        };
    });
    
    // Trigger the export when hitting E (and not having the focus on the
    // search field).
    jQuery(document).bind('keyup', 'e', function(event) {
        // If this is the word details page.
        var search_field = jQuery(".form-search > input[type=search]");
        if (search_field.length > 0) {
            // If the focus is not in the search field.
            if (search_field.is(":not(:focus)")) {
                window.location.href = jQuery(".icon-download-alt").parent()
                    .attr("href");
            };
        }
        else {
            window.location.href = jQuery(".icon-download-alt").parent()
                .attr("href");
        };
    });
    
    // Avoid visiting disabled or active links on pagination.
    $('.pagination .disabled a, .pagination .active a').on('click',
        function(event) {
        event.preventDefault();
    });
});
