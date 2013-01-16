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
# along with Thesaurus-editor.  If not, see <http://www.gnu.org/licenses/>.

from django import forms
from django.utils.translation import ugettext_lazy as _
#from thesaurus.models import *


class ImportForm(forms.Form):#forms.ModelForm):
    imported_file = forms.FileField(label=_("File"))
    #
    #class Meta:
    #    model = Thesaurus
    #
    #def clean(self):
    #    super(forms.ModelForm, self).clean()
    #    cleaned_data = self.cleaned_data
    #    if Thesaurus.objects.filter(name=cleaned_data.get("name")):
    #        msg = _(u"Already exists a thesaurus with the given name. You should provide another one.")
    #        self._errors["name"] = self.error_class([msg])
    #        # This field is no longer valid. Remove it from the cleaned data.
    #        del cleaned_data["name"]
    #    # Always return the full collection of cleaned data.
    #    return cleaned_data



