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
from django.views.generic import TemplateView, ListView, DetailView
#from thesaurus.views import TerminatorListView, ConceptDetailView
from thesaurus.models import Word

urlpatterns = patterns('thesaurus.views',
    url(r'^$', ListView.as_view(
        model=Word,
        context_object_name = "word_list",
        #paginate_by = 3,
        template_name="word_list.html",
    ), name='thesaurus_home'),
    url(r'^words/(?P<pk>[\w\ \-,/!]+)/$', 'word_details', name='thesaurus_word'),
    url(r'^relationships/create/$',
        'create_relationship',
        name='thesaurus_create_relationship'
    ),
    #TODO delete relationship
    #url(r'^relationships/(?P<relationship>\w+)/delete/$',
    #    'delete_relationship', 
    #    name='thesaurus_delete_relationship'
    #),
    url(r'^relationships/addword/$',
        'add_word_to_relationship',
        name='thesaurus_add_word_to_relationship'
    ),
    url(r'^relationships/removeword/$',
        'remove_word_from_relationship',
        name='thesaurus_remove_word_from_relationship'
    ),
    url(r'^search/$',
        'ajax_search',
        name='thesaurus_search'
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

