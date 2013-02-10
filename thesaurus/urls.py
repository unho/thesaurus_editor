# -*- coding: UTF-8 -*-
#
# Copyright 2013 Leandro Regueiro
#
# This file is part of Thesaurus-editor.
# 
# Thesaurus-editor is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by the Free
# Software Foundation, either version 3 of the License, or (at your option) any
# later version.
# 
# Thesaurus-editor is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
# details.
# 
# You should have received a copy of the GNU General Public License along with
# Thesaurus-editor. If not, see <http://www.gnu.org/licenses/>.

from django.conf.urls.defaults import patterns, url
from django.views.generic import TemplateView, ListView
from thesaurus.models import Word

urlpatterns = patterns('thesaurus.views',
    url(r'^$', ListView.as_view(
        model=Word,
        context_object_name = "words",
        paginate_by = 100,
        template_name="word_list.html",
    ), name='thesaurus_home'),
    url(r'^words/(?P<pk>[\w\ \-,/!]+)/$',
        'word_details',
        name='thesaurus_word'
    ),
    url(r'^finalize/$',
        'ajax_finalize_word',
        name='thesaurus_finalize_word'
    ),
    url(r'^unfinalize/$',
        'ajax_unfinalize_word',
        name='thesaurus_finalize_word'
    ),
    url(r'^search/$',
        'ajax_search',
        name='thesaurus_search'
    ),
    url(r'^partofspeech/edit/$',
        'ajax_edit_part_of_speech',
        name='thesaurus_edit_part_of_speech'
    ),
    url(r'^relationships/create/$',
        'ajax_create_relationship',
        name='thesaurus_create_relationship'
    ),
    url(r'^relationships/removeword/$',
        'ajax_remove_word_from_relationship',
        name='thesaurus_remove_word_from_relationship'
    ),
    url(r'^relationships/addword/$',
        'ajax_add_word_to_relationship',
        name='thesaurus_add_word_to_relationship'
    ),
    url(r'^export/$',
        'export',
        name='thesaurus_export'
    ),
    url(r'^import/$',
        'import_words',
        name='thesaurus_import'
    ),
    url(r'^help/$',
        TemplateView.as_view(template_name="help.html"),
        name='thesaurus_help'
    ),
    #TODO terms of service
)

