import hashlib
import html
import sys
from datetime import datetime
from time import time

import re
from flask import request, redirect, render_template, make_response
from flask_restful import Resource, Api, reqparse
from flask.views import MethodView

from werkzeug.datastructures import FileStorage

from app import minichan
from app import model
from app.text_formatter import format_text
from app import thumbnail_generator
from app import config
from app import moderate

api = Api(minichan)
parser = reqparse.RequestParser()
parser.add_argument('subject')
parser.add_argument('body')
parser.add_argument('file', type=FileStorage, location="files")


@minichan.route('/', methods=['GET'])
def newui():
    return render_template('threadlist.html'), 200


class ThreadListAPI(MethodView):
    def get(self):
        return model.Thread.api, 200, {"X-Frame-Options": "ALLOW-FROM youtube.com"}

    def post(self):
        args = parser.parse_args()
        print(args)
        api_create_thread(args["subject"], args["body"], args['file'])
        if model.Thread.objects.count() >= config.NUMBER_OF_THREADS:
            model.Thread.oldest.delete()
        return redirect("/")


class PostListAPI(MethodView):
    def get(self, thread_id):
        result = [dict(model.Thread.objects(post_id=thread_id).exclude('id')[0].to_mongo())]
        result += [dict(reply.to_mongo()) for reply in
                   model.Reply.api(thread_link=model.Thread.objects(post_id=thread_id)[0])]
        return result, 200, {"X-Frame-Options": "ALLOW-FROM youtube.com"}  # for youtube support

    def post(self, thread_id):
        args = parser.parse_args()
        print(args)
        api_create_reply(thread_id, args["body"], args['file'])

        return redirect("/#/thread/{0}".format(thread_id))


class PostAPI(MethodView):
    def get(self, post_id):
        posts = model.Post.objects(post_id=post_id).exclude('id', 'thread_link')
        if len(posts) != 0:
            print(posts)
            result = posts[0].to_mongo();
            print(result)
            return result, 200, {"X-Frame-Options": "ALLOW-FROM youtube.com"}  # for youtube support
        else:
            return None, 400


class ModerateAPI(MethodView):
    def delete(self, post_id):
        mocha = moderate.Deleter()
        mocha.delete_post(post_id)


api.add_resource(ThreadListAPI, '/api/threads')
api.add_resource(PostListAPI, '/api/thread/<string:thread_id>')
api.add_resource(PostAPI, '/api/post/<string:post_id>')
api.add_resource(ModerateAPI, '/api/moderate/<string:post_id>')


def api_create_thread(subject, body, file):
    try:
        thread = model.Thread()
        thread.post_id = next_counter()
        thread.body = format_text(body, config.SPAN_CLASSES)
        thread.subject = subject
        thread.bump_time = time()
        thread.creation_time = datetime.now().strftime("%d.%m.%Y %H:%M:%S")
        thread.save()

        api_upload_multimedia(file, thread)
    except Exception as inst:
        print("Exception type: {}, args: {}".format(type(inst), inst.args))
        print(inst)
    except:
        print("Unexpected error:", sys.exc_info()[0])


def api_create_reply(thread_id, body, file):
    try:
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
        reply.body = format_text(body, config.SPAN_CLASSES)
        reply.thread_link = original_post
        reply.save()

        api_upload_multimedia(file, reply)

        return redirect('/{0}'.format(thread_id))
    except Exception as inst:
        print(type(inst))  # the exception instance
        print(inst.args)  # arguments stored in .args
        print(inst)
    except:
        print("Unexpected error:", sys.exc_info()[0])


def api_upload_multimedia(file, post: model.Post):
    try:
        if file:
            print("Filename = {}, Content type = {}, mimetype = {}"
                  .format(file.filename, file.content_type, file.mimetype))
            file_extension = file.filename.rsplit('.', 1)[-1]
            print("File extension: " + file_extension)
            post_attachment = model.Image(post_link=post)
            if file_extension == "gif":
                print("It's GIF")
                post_attachment.img_src.put(file.stream, content_type='image/gif')
            elif file_extension == "webm":
                print("It's webm")
                post_attachment.img_src.put(file.stream, content_type='video/webm')
                print("generate thumbnail")
                thumbnail = thumbnail_generator.create_video_thumbnail(file.stream)
                print("attach to post")
                post_attachment.img_thumbnail_src.put(thumbnail, content_type='image/jpeg')
            elif file_extension in ["jpg", "png", "jpeg", "gif", "bmp", "tif", "tiff"]:
                print("Other extension: ", file_extension)
                post_attachment.img_src.put(file.stream, content_type=file.mimetype)
                thumbnail = thumbnail_generator.create_image_thumbnail(file.stream)
                post_attachment.img_thumbnail_src.put(thumbnail, content_type='image/jpeg')
            print("Put done. Update thread")

            post_attachment.img_id = str(hashlib.md5(post_attachment.img_src.read()).hexdigest())
            post_attachment.save()
            post.update(set__content_type=post_attachment.img_src.content_type)
            post.update(set__image_id=post_attachment.img_id)
    except Exception as inst:
        print(type(inst))  # the exception instance
        print(inst.args)  # arguments stored in .args
        print(inst)
    except:
        print("Unexpected error:", sys.exc_info()[0])


@minichan.route('/img/<img_id>', methods=['GET'])
def image(img_id):
    image = model.Image.objects(img_id=img_id).first()
    myimage = image.img_src.read()
    response = make_response(myimage)
    response.headers['Content-Type'] = image.img_src.content_type
    return response


@minichan.route('/thumb/<img_id>', methods=['GET'])
def imagethumb(img_id):
    image = model.Image.objects(img_id=img_id).first()
    myimage = image.img_thumbnail_src.read()
    if myimage is None:
        myimage = image.img_src.read()
    response = make_response(myimage)
    response.headers['Content-Type'] = 'image/jpeg'
    return response


@minichan.errorhandler(500)
def page_not_found(error):
    return render_template('500.html'), 500


def next_counter():
    model.Counter.objects(name='post_counter').update_one(inc__next_id=1)
    return model.Counter.objects[0].next_id


# deprecated

@minichan.route('/old', methods=['GET', 'POST'])
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


@minichan.route('/old/<thread_id>', methods=['GET', 'POST'])
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
