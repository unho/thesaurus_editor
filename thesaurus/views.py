# -*- coding: UTF-8 -*-
#
# Copyright 2013 Leandro Regueiro
#
# This file is part of Thesaurus-editor.
# 
# Terminator is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# Terminator is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with Terminator.  If not, see <http://www.gnu.org/licenses/>.

import datetime

from django.shortcuts import render_to_response#, get_list_or_404, get_object_or_404, Http404
#from django.views.generic import DetailView, ListView, TemplateView
from django.views.decorators.csrf import csrf_protect
from django.db import transaction
from django.template import loader, Context, RequestContext
from django.http import HttpResponse
from django.utils.translation import ugettext_lazy as _
#from django.core.paginator import Paginator, InvalidPage, EmptyPage

from thesaurus.models import *
from thesaurus.forms import *


def export(request):
    # Create the HttpResponse object with the appropriate header.
    response = HttpResponse(mimetype='text/plain')
    now = datetime.datetime.today()
    response['Content-Disposition'] = 'attachment; filename=thesaurus_' + now.strftime("%Y-%m-%d-%X") + '.txt'
    # Create the response
    template = loader.get_template('export.txt')
    context = Context({'words': Word.objects.all()})
    response.write(template.render(context))
    return response


@transaction.commit_manually
def import_uploaded_file(uploaded_file):
    try:
        for line in uploaded_file:
            line = line.replace("\n", "")#TODO fails when using unicode strings
            word = Word(word=line)
            word.save()
    except:
        # Some exception was raised while extracting the data from the uploaded file
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
                import_error_message = _("The uploaded file is not a valid one.")
                context['import_error_message'] = import_error_message
            else:
                import_message = _("File succesfully imported. Thank you!")
                context['import_message'] = import_message
                import_form = ImportForm()
    else:
        import_form = ImportForm()
    context['import_form'] = import_form
    return render_to_response('import.html', context, context_instance=RequestContext(request))




def delete_word_from_relationship(request, relationship, word):
    context = {'words': Word.objects.all()}#TODO cambiar
    return render_to_response('export.txt', context)



