import re
import sys

def youtube_embed(text):
    youtube_links = re.findall(r"(\[link\].*?youtu.*?be.*?\[/link\])", text)
    if youtube_links:
        for link in youtube_links:
            try:
                video_id = re.findall(r"((?<=(v|V)/)|(?<=be/)|(?<=(\?|\&)v=)|(?<=embed/))([\w-]+)", link)[-1][-1]
                frame = "<div onclick=OpenFrame(this); class='youtube-tumb' data-id='{0}' style='background-image:url(http://img.youtube.com/vi/{0}/hqdefault.jpg)'></div>".format(video_id)
                text = text.replace(link, frame)
            except:
                print("Failed to take video_id:", sys.exc_info()[0])
    return text


def yandex_music(text):
    ya_music_links = re.findall(r"(\[link\].*?music.yandex.ru/album/.*?\[/link\])", text)
    if ya_music_links:
        for link in ya_music_links:
            try:
                album_id = re.findall(r"/album/(\d*)", link)[0]
                if "track" in link:
                    track_id = re.findall(r"/track/(\d*)", link)[0]
                    frame = "<iframe class=yamusic-track frameborder='0' width='400' height='100' data-source='https://music.yandex.ru/iframe/#track/{0}/{1}/'></iframe>".format(
                        track_id, album_id)
                    text = text.replace(link, frame)
                else:
                    frame = "<iframe class=yamusic-album frameborder='0' width='300' height='600' data-source='https://music.yandex.ru/iframe/#album/{0}/'></iframe>".format(album_id)
                    text = text.replace(link, frame)
            except:
                print("Failed to take yandex music track:", sys.exc_info()[0])
    return text