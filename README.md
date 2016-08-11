VeeamChan
========


### Tech
Veeamchan uses a number of open source projects to work properly:
* Python 3
* [MongoDB](https://www.mongodb.com/)
* [Flask](http://flask.pocoo.org/) - python web-framework based on Jinja2
* [Twitter Bootstrap](http://getbootstrap.com/)
* [jQuery](https://jquery.com/)

### Functions
* Post attachments
* Text markup
* Support .webm, .gif animation
* Autoload of Youtube and Yandex.Music frames. Syntax is [link]link[/link]

## Utils
Repo contain additional scripts:

*utils/mocherator.py*  
Script permanently delete from db
** replies (with content)
** threads and all replies that thread contain
```sh
$python3 ./mocherator.py 12 23 44
```
*utils/mongo_transfer.py*  
Script change db schema for type of attachments. Usefull for migration from original [minichan](https://github.com/imageboards/minichan).

