import os, sys
import argparse
import ffmpy
from moviepy.editor import *

import io
from PIL import Image
from subprocess import Popen, PIPE
from werkzeug.datastructures import FileStorage


def create_video_thumbnail(video_src):
    video_src.seek(0)
    thumb_binary_stream = io.BytesIO()
    p = Popen(["ffmpeg", "-i", "-", "-vframes", "1", "-f", "singlejpeg",  "-"],
              stdin=video_src, stdout=PIPE)
    file_storage = FileStorage(stream=thumb_binary_stream, filename="thumbnail.jpg", content_type="image/jpeg",
                               name="file")
    while True:
        data = p.stdout.read(1024)
        if len(data) == 0:
            break
        thumb_binary_stream.write(data)
    print(p.wait())
    thumb_binary_stream.seek(0)
    return file_storage


def create_image_thumbnail(img_src):
    img_src.seek(0)
    thumb_binary_stream = io.BytesIO()
    file_storage = FileStorage(stream=thumb_binary_stream, filename="thumbnail.jpg", content_type="image/jpeg",
                               name="file")
    size = 500, 500
    ssimage = Image.open(img_src)
    ssimage.copy()
    ssimage.thumbnail(size)
    ssimage.save(thumb_binary_stream, format="JPEG")
    thumb_binary_stream.seek(0)
    return file_storage

