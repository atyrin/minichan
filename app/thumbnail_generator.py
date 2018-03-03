import os, sys
import argparse

import io
from PIL import Image
from subprocess import Popen, PIPE
from werkzeug.datastructures import FileStorage


def create_video_thumbnail(video_src):
    video_src.seek(0)
    p = Popen(["ffmpeg", "-i", "-", "-vframes", "1", "-vf", "scale=500:281",  "-f", "singlejpeg", "-"],
              stdin=video_src, stdout=PIPE)
    file_storage = FileStorage(stream=p.stdout, filename="thumbnail.jpg", content_type="image/jpeg",
                               name="file")
    # p.stdout.seek(0)
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

