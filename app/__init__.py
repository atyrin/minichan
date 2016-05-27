from flask import Flask
from mongoengine import *

from app.config import *
from app.model import *


connect("local")

Counter(name='post_counter').save()

minichan = Flask(__name__)

import app.view
