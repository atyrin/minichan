import re


def convert_text_to_span_class(text, class_name):
    return re.sub(r"\[" + class_name + "\](.*)\[/" + class_name + "\]",
                  lambda m: "<span class=\"" + class_name + "\">{0}</span>".format(m.group(1)),
                  text)


def format_links(text):
    return re.sub(r"\[link\](.*)\[/link\]",
                  lambda m: r'<a href="{0}">{0}</a>'.format(
                      m.group(1) if re.search('http', m.group(1)) else "http://" + m.group(1)),
                  text)


def format_reply(text):
    return re.sub(">>(\d*)",
                  lambda
                      m: '<a class=\"reply\" onClick=document.getElementById(\"{1}\").scrollIntoView() data-target=\"{1}\">{0}</a>'.format(
                      m.group(0), m.group(1)),
                  text)


def format_text(text, span_classes):
    for SpanClass in span_classes:
        text = convert_text_to_span_class(text, SpanClass)
    text = format_links(text)
    text = format_reply(text)
    return text
