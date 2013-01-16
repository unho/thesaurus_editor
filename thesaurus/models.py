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
# along with Thesaurus-editor. If not, see <http://www.gnu.org/licenses/>.

from django.db import models


#class Language(models.Model):
#    iso_code = models.CharField(primary_key=True, max_length=10)
#    name = models.CharField(max_length=50)
#    
#    def __unicode__(self):
#        return u"%(iso_code)s" % self.iso_code


#class Thesaurus(models.Model):
#    name = models.CharField(primary_key=True, max_length=50)
#    language = models.ForeignKey(Language, null=True, on_delete=models.SET_NULL)
#    
#    def __unicode__(self):
#        return self.name


class Word(models.Model):
    word = models.CharField(primary_key=True, max_length=100)
    #thesaurus = models.ForeignKey(Thesaurus)
    
    class Meta:
        ordering = ['word']
        #unique_together = ("word", "thesaurus")#TODO in case of uncommenting this, remove primary_key=True from word field.
    
    def __unicode__(self):
        return self.word
    
    def _retrieve_list(self, relationship_type):
        relationship_list = []
        for relationship in self.relationship_set.filter(relationship_type=relationship_type):
            #TODO export the relationship objects too, since it is neccessary for getting the part of speech.
            #TODO export the relationship intermediary table, since it is neccessary for getting the notes.
            relationship_list.append(relationship.words.exclude(word=self))
        return relationship_list
    
    def retrieve_synonyms(self):
        return self._retrieve_list("S")
    
    def retrieve_antonyms(self):
        return self._retrieve_list("A")
    
    def retrieve_related_words(self):
        return self._retrieve_list("R")
    
    #def next_word(self):
    #    return 


class Relationship(models.Model):
    RELATIONSHIP_CHOICES = (
        (u'S', u'Synonym'),
        (u'A', u'Antonym'),
        (u'R', u'Related'),
    )
    relationship_type = models.CharField(max_length=2, choices=RELATIONSHIP_CHOICES)
    words = models.ManyToManyField(Word, through='WordsForRelationship')
    pos = models.CharField(max_length=20, null=True, blank=True)# Part of speech
    
    def __unicode__(self):
        return u"%(type)s: %(words)s" % {"type": self.get_relationship_type_display(), "words": self.words.all()}


class WordsForRelationship(models.Model):
    relationship = models.ForeignKey(Relationship)
    word = models.ForeignKey(Word)
    note = models.CharField(max_length=20, null=True, blank=True)# Like (generic word) or something like that
    
    class Meta:
        unique_together = ("relationship", "word")


