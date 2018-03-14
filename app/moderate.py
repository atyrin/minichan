from app import model


class Deleter:
    def __validator(self, reply):
        if reply is not None:
            try:
                int(reply)
            except ValueError as e:
                return "Some arguments contain string, not int"
        else:
            return "Input param is None"

    def __delete_thread(self, post):
        print("Remove thread: {}".format(post))
        try:
            model.Thread.objects(post_id=post)[0].delete()
        except Exception as err:
            print(err)

    def __delete_reply(self, post):
        print("Remove reply: {}".format(post))
        try:
            model.Reply.objects(post_id=post)[0].delete()
        except Exception as err:
            print(err)

    def delete_post(self, post):
        result = self.__validator(post)
        if result is None:
            post_data = model.Post.objects(post_id=post)
            try:
                post_type = post_data[0]["_cls"]
                if post_type == "Post.Reply":
                    self.__delete_reply(post)
                elif post_type == "Post.Thread":
                    self.__delete_thread(post)
                else:
                    print("Unknown type {}".format(post_type))
            except TypeError as err:
                print(err)
        else:
            print(result)
