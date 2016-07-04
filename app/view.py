from time import time
from datetime import datetime
import hashlib
import html
import re
import sys

from flask import request, redirect, render_template, make_response

from app import minichan
from app import model
from app import config


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
        if original_post.bump_counter >= config.BUMP_LIMIT:
            original_post.update(set__bump_limit=True)
        else:
            original_post.update(set__bump_time=time())

        reply = model.Reply()
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
                print("put done")
            else:
                print("Other extension: ", file_extension)
                post_attachment.img_src.put(photo, content_type='image/jpeg')
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
    text = youtube_embed(text)
    return re.sub(r"\[link\](.*?)\[/link\]", r'<a href="\1">\1</a>', text)


def youtube_embed(text):
    youtube_links = re.findall(r"(\[link\].*?youtu.*?be.*?\[/link\])", text)
    if youtube_links:
        for link in youtube_links:
            try:
                video_id = re.findall(r"((?<=(v|V)/)|(?<=be/)|(?<=(\?|\&)v=)|(?<=embed/))([\w-]+)", link)[-1][-1]
                frame = "<iframe width='560' height='315' src='https://www.youtube.com/embed/{0}' frameborder='0' allowfullscreen></iframe>".format(
                    video_id)
                text = text.replace(link, frame)
            except:
                print("Failed to take video_id:", sys.exc_info()[0])
    return text


def format_text(text, span_classes):
    for SpanClass in span_classes:
        text = convert_text_to_span_class(text, SpanClass)
    text = format_links(text)
    return text
