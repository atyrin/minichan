import sys

from pymongo import MongoClient

#from app import MONGO_HOST, MONGO_DATABASE_NAME, MONGO_PORT
#temp changes

MONGO_HOST = "localhost"
MONGO_PORT = 27017
MONGO_DATABASE_NAME = "local"

class Deleter:
    def __init__(self):
        self.connection = MongoClient(MONGO_HOST, MONGO_PORT)
        self.db = self.connection[MONGO_DATABASE_NAME]
        self.posts = self.db.get_collection("post")
        self.image = self.db.get_collection("image")
        self.files = self.db.get_collection("fs.files")
        self.chunks = self.db.get_collection("fs.chunks")

    def validator(self, reply_list):
        if len(reply_list) != 0:
            for reply in reply_list:
                try:
                    int(reply)
                except ValueError as e:
                    return "Some arguments contain string, not int"
        else:
            return "Argument doesn't contain post numbers"

    def check_post_type(self, post):
        post_data = self.posts.find_one({"post_id": int(post)})
        try:
            post_type = post_data["_cls"]
            if post_type == "Post.Reply":
                print("Post {} is simple reply".format(post))
                return [0, post_data]
            elif post_type == "Post.Thread":
                print("Post {} is topic starter".format(post))
                return [1, post_data]
            else:
                return [2, "Unknown type"]
        except TypeError:
            return [2, "There is not such post: {}".format(post)]

    def delete_thread(self, post_json):
        size = self.posts.find({"thread_link": post_json["_id"]}).count()
        print("It's op post, contain {} replies".format(size))
        answer = input("Are you sure to delete all thread? (y/n) \n")
        if answer.lower() == "y":
            print("GO")
            for i in range(size):
                self.delete_reply(self.posts.find_one({"thread_link": post_json["_id"]}))
            print("All replies was removed. Delete OP post.")
            self.delete_reply(post_json)
        elif answer.lower() == "n":
            print("Okay")
        else:
            print("This script doesn't contain retries. Your answer was incorrect.")

    def delete_image(self, image_id, post_id):
        image = self.image.find_one({"img_id": image_id, "post_link": post_id})
        image_src = image["img_src"]
        self.chunks.remove({"files_id": image_src})
        self.files.remove({"_id": image_src})
        self.image.remove({"img_id": image_id, "post_link": post_id})

    def delete_reply(self, post_json):
        print("Reply body: {}".format(post_json["body"]))
        try:
            image_id = post_json["image_id"]
            print("Remove reply image")
            self.delete_image(image_id=image_id, post_id=post_json["_id"])
        except KeyError:
            print("Reply doesnt contain picture")
        self.posts.remove(post_json)

    def delete_post(self, postlist):
        postlist = postlist[1:]
        result = self.validator(postlist)
        if result is None:
            for post in postlist:
                print("=== Working with post: {}".format(post))
                checker = self.check_post_type(post)
                if checker[0] == 0:
                    self.delete_reply(checker[1])
                elif checker[0] == 1:
                    self.delete_thread(checker[1])
                else:
                    print(checker[1])

        else:
            print(result)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connection.close()


if __name__ == "__main__":
    kek = Deleter()
    kek.delete_post(sys.argv)
