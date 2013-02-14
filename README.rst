Thesaurus_editor
-------------------
Web editor for thesaurus, aimed to generate files for creating thesaurus for OpenOffice and LibreOffice.

Local Installation
-------------------
In order to locally install Thesaurus_editor you have to follow this steps:

- Install Python (most GNU/Linux distributions have it already).
- Install Django 1.4 or newer (see the `Installation instructions
  <https://docs.djangoproject.com/en/dev/intro/install/>`_).
- Install MySQL (if you use another Django supported database you have to
  then change the settings accordingly).
- Install the Python bindings for MySQL (or whichever database manager did you
  install).
- Create an UTF-8 encoded database named 'thesaurus' (if you use another name
  then change the settings accordingly).
- Change the databases section in the settings.py file to match your newly
  created database settings.
- Get the Thesaurus_editor code and put it .
- Open a terminal and go to the directory where is your local copy of
  Thesaurus_editor code.
- Run 'python manage.py syncdb' on the terminal (reply 'no' to the create a
  superuser now question).
- Run 'python manage.py runserver' on the terminal.
- Open a browser and visit `http://127.0.0.1:8000/ <http://127.0.0.1:8000/>`_.
