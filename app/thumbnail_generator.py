import os, sys

import io
from PIL import Image
from werkzeug.datastructures import FileStorage


def create_video_thumbnail(video_src):
    return 0


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