import re


def convert_text_to_span_class(text, class_name):
    text = text.replace(("[" + class_name + "]"), "<span class=\"" + class_name + "\">")
    text = text.replace(("[/" + class_name + "]"), "</span>")  # TO DO:Replace with regex
    return text


def format_links(text):
    return re.sub(r"\[link\](.*)\[/link\]", r'<a href="\1">\1</a>', text)


def format_text(text, span_classes):
    for SpanClass in span_classes:
        text = convert_text_to_span_class(text, SpanClass)
    text = format_links(text)
    return text
