import hashlib
import html
import sys
from datetime import datetime
from time import time

import re
from flask import request, redirect, render_template, make_response
from flask_restful import Resource, Api
from flask.views import MethodView

from app import minichan
from app import model
from app.text_formatter import format_text
from app import thumbnail_generator
from app import config
from app import embeded_content

api = Api(minichan)

@minichan.route('/new', methods=['GET'])
def newui():
    return render_template('threadlist.html'), 200


class ThreadListAPI(MethodView):
    def get(self):
        return model.Thread.api, 200, {"X-Frame-Options": "ALLOW-FROM youtube.com"}
    def post(self):
        pass

class PostListAPI(MethodView):
    def get(self, thread_id):
        result = [dict(model.Thread.objects(post_id=thread_id).exclude('id')[0].to_mongo())]
        result+=[dict(reply.to_mongo()) for reply in
                           model.Reply.api(thread_link=model.Thread.objects(post_id=thread_id)[0])]
        return result, 200, {"X-Frame-Options": "ALLOW-FROM youtube.com"} #for youtube support

    def post(self):
        pass

api.add_resource(ThreadListAPI, '/api/threads')
api.add_resource(PostListAPI, '/api/thread/<string:thread_id>')


@minichan.route('/', methods=['GET', 'POST'])
def board():
    if request.method == 'POST':
        if model.Thread.objects.count() >= config.NUMBER_OF_THREADS:
            model.Thread.oldest.delete()

        thread = model.Thread()
        thread.post_id = next_counter()
        thread.body = html.escape(request.form['body'])
        thread.body = format_text(thread.body, config.SPAN_CLASSES)
        thread.subject = request.form['subject']
        thread.bump_time = time()
        thread.creation_time = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        thread.save()

        upload_multimedia(request, thread)

        return redirect('/')
    else:
        return render_template('board.html', data=model.Thread.all)



@minichan.route('/<thread_id>', methods=['GET', 'POST'])
def thread(thread_id):
    if request.method == 'POST':
        original_post = model.Thread.objects(post_id=thread_id)[0]
        original_post.update(inc__bump_counter=1)
        reply = model.Reply()
        if original_post.bump_counter >= config.BUMP_LIMIT:
            original_post.update(set__bump_limit=True)
            reply.subject = "bump limit was overloaded"
        else:
            original_post.update(set__bump_time=time())
        reply.post_id = next_counter()
        reply.creation_time = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        reply.body = html.escape(request.form['body'])
        reply.body = format_text(reply.body, config.SPAN_CLASSES)
        reply.thread_link = original_post
        reply.save()

        upload_multimedia(request, reply)

        return redirect('/{0}'.format(thread_id))
    else:
        data = {
            "original_post": dict(model.Thread.objects(post_id=thread_id)[0].to_mongo()),
            "reply_list": [dict(reply.to_mongo()) for reply in
                           model.Reply.all(thread_link=model.Thread.objects(post_id=thread_id)[0])]
        }
        response = make_response(render_template('thread.html', data=data))
        response.headers["X-Frame-Options"] = "ALLOW-FROM youtube.com"
        return response



@minichan.route('/img/<img_id>', methods=['GET'])
def image(img_id):
    image = model.Image.objects(img_id=img_id).first()
    myimage = image.img_src.read()
    response = make_response(myimage)
    response.headers['Content-Type'] = 'image/jpeg'
    return response

@minichan.route('/thumb/<img_id>', methods=['GET'])
def imagethumb(img_id):
    image = model.Image.objects(img_id=img_id).first()
    myimage = image.img_src.read()
    response = make_response(myimage)
    response.headers['Content-Type'] = 'image/jpeg'
    return response


@minichan.errorhandler(500)
def page_not_found(error):
    return render_template('500.html'), 500


def upload_multimedia(post_request, post: model.Post):
    try:
        photo = post_request.files['file']
        if photo.filename:
            print("Filename = ", photo.filename)
            file_extension = photo.filename.rsplit('.', 1)[-1]
            print("type: " + file_extension)
            post_attachment = model.Image(post_link=post)
            if file_extension == "gif":
                print("It's GIF")
                post_attachment.img_src.put(photo, content_type='image/gif')
                print("put done")
            elif file_extension == "webm":
                print("It's webm")
                post_attachment.img_src.put(photo, content_type='video/webm')
                thumbnail = thumbnail_generator.create_video_thumbnail(photo)
                post_attachment.img_thumbnail_src.put(thumbnail, content_type='image/jpeg')
                print("put done")
            else:
                print("Other extension: ", file_extension)
                post_attachment.img_src.put(photo, content_type='image/jpeg')
                thumbnail = thumbnail_generator.create_image_thumbnail(photo)
                post_attachment.img_thumbnail_src.put(thumbnail, content_type='image/jpeg')

                print("Other extension:", post_attachment.img_src.content_type)
                print("put done")

            post_attachment.img_id = str(hashlib.md5(post_attachment.img_src.read()).hexdigest())
            post_attachment.save()
            post.update(set__content_type=post_attachment.img_src.content_type)
            post.update(set__image_id=post_attachment.img_id)
    except:
        print("Unexpected error:", sys.exc_info()[0])


def next_counter():
    model.Counter.objects(name='post_counter').update_one(inc__next_id=1)
    return model.Counter.objects[0].next_id


def convert_text_to_span_class(text, class_name):
    text = text.replace(("[" + class_name + "]"), "<span class=\"" + class_name + "\">")
    text = text.replace(("[/" + class_name + "]"), "</span>")  # TO DO:Replace with regex
    return text


def format_links(text):
    text = embeded_content.youtube_embed(text)
    text = embeded_content.yandex_music(text)
    return re.sub(r"\[link\](.*?)\[/link\]", r'<a target="_blank" href="\1">\1</a>', text)


def format_text(text, span_classes):
    for SpanClass in span_classes:
        text = convert_text_to_span_class(text, SpanClass)
    text = format_links(text)
    return text
