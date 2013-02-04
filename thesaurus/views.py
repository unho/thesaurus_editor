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

import datetime

from django.shortcuts import render_to_response, Http404, get_object_or_404
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.db import transaction
from django.template import loader, Context, RequestContext
from django.http import HttpResponse
from django.utils.translation import ugettext_lazy as _
from django.utils.encoding import smart_unicode

from thesaurus.models import *
from thesaurus.forms import *


def export(request):
    # Create the HttpResponse object with the appropriate header.
    response = HttpResponse(mimetype='text/plain')
    now = datetime.datetime.today()
    response['Content-Disposition'] = ('attachment; filename=thesaurus_%s.txt'
                                      % now.strftime("%Y-%m-%d-%X"))
    # Create the response
    template = loader.get_template('export.txt')
    context = Context({'words': Word.objects.all()})
    response.write(template.render(context))
    return response


@transaction.commit_manually
def import_uploaded_file(uploaded_file):
    try:
        for line in uploaded_file:
            line = smart_unicode(line.replace("\n", "").split("|")[0])
            word = Word(word=line)
            word.save()
    except:
        # Some exception was raised while extracting the data from the uploaded
        # file.
        transaction.rollback()
        raise Exception
    else:
        transaction.commit()


@csrf_protect
def import_words(request):
    context = {}
    if request.method == 'POST':
        import_form = ImportForm(request.POST, request.FILES)
        if import_form.is_valid():
            try:
                import_uploaded_file(request.FILES['imported_file'])
            except:
                import_error_message = _("The uploaded file is not valid.")
                context['import_error_message'] = import_error_message
            else:
                import_message = _("File succesfully imported. Thank you!")
                context['import_message'] = import_message
                import_form = ImportForm()
    else:
        import_form = ImportForm()
    context['import_form'] = import_form
    return render_to_response('import.html', context,
                              context_instance=RequestContext(request))


@ensure_csrf_cookie
def word_details(request, pk):
    word = get_object_or_404(Word, pk=pk)
    return render_to_response('word_details.html', {'word': word},
                              context_instance=RequestContext(request))


def ajax_search(request):
    word = request.GET.get('word')
    current = request.GET.get('current')
    if word is not None and current is not None:
        results = Word.objects.filter(word__contains=word).exclude(word=current)
    else:
        results = []
    context = {'search_results': results}
    return render_to_response('search_results.html', context,
                              context_instance=RequestContext(request))


def ajax_create_relationship(request):
    if not request.method == 'POST':
        raise Http404
    relationship_type = request.POST.get('type')
    current = request.POST.get('current')
    new_word = request.POST.get('new_word')
    
    # Get the objects corresponding to the word
    current_word_object = get_object_or_404(Word, word=current)
    new_word_object = get_object_or_404(Word, word=new_word)
    
    # Get the relationship type
    if relationship_type == "synonyms":
        rel_type="S"
    elif relationship_type == "antonyms":
        rel_type="A"
    elif relationship_type == "related-words":
        rel_type="R"
    else:
        raise Http404
    
    # Create a new relationship
    rel = Relationship(relationship_type=rel_type)
    rel.save()
    
    # Add the words to the new relationship
    WordsForRelationship(relationship=rel, word=current_word_object).save()
    WordsForRelationship(relationship=rel, word=new_word_object).save()
    
    context = {'word': current_word_object, 'selected_meaning': rel.pk}
    return render_to_response(relationship_type + '_snippet.html', context,
                              context_instance=RequestContext(request))


def ajax_remove_word_from_relationship(request):
    if not request.method == 'POST':
        raise Http404
    relationship_type = request.POST.get('type')
    if not (relationship_type == "synonyms" or relationship_type == "antonyms"
            or relationship_type == "related-words"):
        raise Http404
    current = request.POST.get('current')
    word = request.POST.get('word')
    relationship = request.POST.get('relationship')
    
    # Get the objects.
    current_word_object = get_object_or_404(Word, word=current)
    word_object = get_object_or_404(Word, word=word)
    relationship_object = get_object_or_404(Relationship, pk=relationship)
    
    # Remove the word from the relationship.
    get_object_or_404(WordsForRelationship, word=word_object,
                           relationship=relationship_object).delete()
    
    # Remove the relationship if only has another word.
    if relationship_object.words.count() == 1:
        relationship_object.words.clear()
        relationship_object.delete()
    
    context = {'word': current_word_object}
    return render_to_response(relationship_type + '_snippet.html', context,
                              context_instance=RequestContext(request))


def ajax_add_word_to_relationship(request):
    if not request.method == 'POST':
        raise Http404
    relationship_type = request.POST.get('type')
    relationship = request.POST.get('relationship')
    current = request.POST.get('current')
    new_word = request.POST.get('new_word')
    
    # Get the objects
    current_word_object = get_object_or_404(Word, word=current)
    new_word_object = get_object_or_404(Word, word=new_word)
    rel = get_object_or_404(Relationship, pk=relationship)
    
    # Add the word to the existing relationship
    WordsForRelationship(relationship=rel, word=new_word_object).save()
    
    context = {'word': current_word_object, 'selected_meaning': rel.pk}
    return render_to_response(relationship_type + '_snippet.html', context,
                              context_instance=RequestContext(request))



