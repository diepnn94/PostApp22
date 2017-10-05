import pymongo
from pymongo import MongoClient
import datetime
from flask_mail import Mail, Message
import mailInfo
# user = "amynguyen"
#
# uri = "mongodb://amynguyen:amynguyen@ds163294.mlab.com:63294/post-app"
#
# # client = MongoClient("localhost", 27017);
# client = MongoClient(uri);
# db = client.PostAppUserProfile;
KEY = "postapptesting2017"

# def inserttoDB(name, email, username, password, key):
def inserttoDB(db,name, email, username, password):

    result = db.user.find({"username":username});
    if result.count() == 0:
        db.user.insert_one(
        {
            "name":name,
            "email":email,
            "username":username,
            "password": password,
            # "key":KEY,
            "confirmation": 0
            }
        )
        return "success"
    return "The username already existed. Please try again.";


def login(db,name, password):
    result = db.user.find({"username":name});
    if result.count() > 0:
        for item in result:
            if item['password'] == password and item['confirmation'] == 1:
                return "success";
            elif item['password'] == password and item['confirmation'] == 0:
                return "Confirm Key";
            else:
                return "fail";
    return "fail";

def confirmation(db,username,key):
    if key == KEY:
        result = db.user.update_one(
            {"username": username},
            {"$set":
                {
                    "confirmation":1
                }
            }
        )
        if result.modified_count == 0:
            return "user error"
        return "success"
    else:
        return "fail"

def postMessage(db,username, content):
    if content is not None:
        if len(content ) > 0:
            db.message.insert_one(
            {
                "posted-by": username,
                "timestamp": datetime.datetime.now(),
                "content": content.strip()
            }
            )

def getMessage(db):
    result = db.message.find().sort('timestamp',pymongo.ASCENDING);
    return result;


def sendEmailConfimation(name,username, receivers):
    msg = Message("Welcome to Post App", sender = mailInfo.mailSetup().username, recipients = [receivers]);
    msg.body = "Hello {}, thank you for joining Post App. Your username is {} and your KEY is {}.\
    Please keep this email as a record and use the KEY to complete your registration.\n\
    Sincerely,\n\
    Post App".format(name, username, KEY);
    return msg;
