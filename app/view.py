from time import time
from datetime import datetime
import hashlib
import html
import re

from flask import request, redirect, render_template, make_response

from app import minichan
from app import model
from app import config


@minichan.route('/sandbox', methods=['GET'] )
def sandbox():
    return render_template('sandbox.html')


@minichan.route('/', methods=['GET', 'POST'])
def board():
    if request.method == 'POST':
        if model.Thread.objects.count() >= config.NUMBER_OF_THREADS:
            model.Thread.oldest.delete()

        thread = model.Thread()
        thread.post_id = next_counter()
        thread.body = html.escape(request.form['body'])
        thread.body = FormatText(thread.body, config.SPAN_CLASSES)
        thread.subject = request.form['subject']
        thread.bump_time = time()
        thread.creation_time = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        thread.save()

        try:
            photo = request.files['file']
            print("Filename = ", photo.filename)
            type = photo.filename.rsplit('.',1)[-1]
            print("type: "+ type)
            image = model.Image(post_link=reply)
            if type == "gif":
                print("It's GIF")
                image.img_src.put(photo, content_type = 'image/gif')
                print("put done")              
            elif type == "webm":
                print("It's webm")
                image.img_src.put(photo, content_type = 'video/webm')
                print("put done")
            else:
                print("Other extension: ", type)
                image.img_src.put(photo, content_type = 'image/jpeg')
                print("put done")

            image.img_id = str(hashlib.md5(image.img_src.read()).hexdigest())
            image.save()

            thread.update(set__image_id=image.img_id)
        except:
            pass

        return redirect('/')
    else:
        return render_template('board.html', data=model.Thread.all)
        #return render_template('sandbox.html')



@minichan.route('/<thread_id>', methods=['GET', 'POST'])
def thread(thread_id):
    if request.method == 'POST':
        original_post = model.Thread.objects(post_id=thread_id)[0]
        original_post.update(inc__bump_counter=1)
        if original_post.bump_counter >= config.BUMP_LIMIT:
            original_post.update(set__bump_limit=True)
        else:
            original_post.update(set__bump_time=time())

        reply = model.Reply()
        reply.post_id = next_counter()
        reply.creation_time = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        reply.body = html.escape(request.form['body'])
        reply.body = FormatText(reply.body, config.SPAN_CLASSES)
        reply.thread_link = original_post
        reply.save()

        try:
            photo = request.files['file']
            print("Filename = ", photo.filename)
            type = photo.filename.rsplit('.',1)[-1]
            print("type: "+ type)
            image = model.Image(post_link=reply)

            if type == "gif":
                print("It's GIF")
                image.img_src.put(photo, content_type = 'image/gif')
                print("put done")              
            elif type == "webm":
                print("It's webm")
                image.img_src.put(photo, content_type = 'video/webm')
                print("put done")
            else:
                print("Other extension: ", type)
                image.img_src.put(photo, content_type = 'image/jpeg')
                print("put done")

            image.img_id = str(hashlib.md5(image.img_src.read()).hexdigest())
            image.save()

            reply.update(set__image_id=image.img_id)
        except:
            print("Exception was catched")

        return redirect('/{0}'.format(thread_id))
    else:
        data = {
        "original_post": dict(model.Thread.objects(post_id=thread_id)[0].to_mongo()),
        "reply_list": [dict(reply.to_mongo()) for reply in model.Reply.all(thread_link=model.Thread.objects(post_id=thread_id)[0])]
        }
        return render_template('thread.html', data=data)
        


@minichan.route('/<img_type>/<img_id>', methods=['GET'])
def image(img_type, img_id):
    if img_type == 'thumb':
        image = model.Image.objects(img_id=img_id).first()
        myimage = image.img_src.read()
        response = make_response(myimage)
        response.headers['Content-Type'] = 'image/jpeg'
        return response
    else:
        image = model.Image.objects(img_id=img_id).first()
        myimage = image.img_src.read()
        response = make_response(myimage)
        response.headers['Content-Type'] = image.img_src.content_type
        return response

def next_counter():
    model.Counter.objects(name='post_counter').update_one(inc__next_id=1)
    return model.Counter.objects[0].next_id
	
def ConvertTextToSpanClass( Text, ClassName ):
    Text = Text.replace(("["+ClassName+"]"), "<span class=\""+ ClassName + "\">")
    Text = Text.replace(("[/"+ClassName+"]"), "</span>" ) #TO DO:Replace with regex
    return Text
		
def FormatLinks(Text):
    return re.sub(r"\[link\](.*)\[\/link\]",r'<a href="\1">\1</a>',Text)

def FormatText(Text, SpanClasses):
    for SpanClass in SpanClasses:
        Text = ConvertTextToSpanClass(Text, SpanClass)
    Text = FormatLinks(Text)
    return Text