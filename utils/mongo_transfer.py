# transfer db state from ImageField to FileField
# useful if you have used minichan before veeamchan

from pymongo import MongoClient

from app import MONGO_HOST, MONGO_PORT, MONGO_DATABASE_NAME

source = "images"
target = "fs"


class Transfer:
    def __init__(self):
        self.address = MONGO_HOST
        self.port = MONGO_PORT

    def connect(self):
        self.db = MongoClient(self.address, self.port)
        print("Connected")
        print("DBs on this instance: ", self.db.database_names())

    def get_collections(self, usedb):
        current = self.db[usedb]
        col = current.collection_names()
        return col

    def get_collection(self, col_name):
        return self.db[MONGO_DATABASE_NAME].get_collection(col_name)

    def __copy_chunk(self, source, target):
        self.source_col = self.get_collection(source + ".chunks")
        self.target_col = self.get_collection(target + ".chunks")
        cur = self.source_col.find()
        print(cur)
        self.target_col.insert(cur)

    def __copy_files(self, source, target):
        self.source_col = self.get_collection(source + ".files")
        self.target_col = self.get_collection(target + ".files")
        for i in range(self.source_col.count()):
            element = self.source_col.find_one()
            temp = dict(element)
            print("Before: ", element)
            element['contentType'] = "image/" + element['format'].lower()
            del element['format']
            try:
                del element["thumbnail_id"]
                del element["width"]
                del element["height"]
            except:
                pass
            print("After: ", element)
            self.target_col.insert_one(element)
            self.source_col.remove(temp)

    def transfer(self, source, target):
        self.__copy_files(source, target)
        self.__copy_chunk(source, target)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.db.close()


kek = Transfer()

kek.connect()
kek.transfer(source, target)
