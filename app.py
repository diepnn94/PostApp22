from forms import RegistrationForm
from forms import LoginForm
from forms import PostForm
from flask import session,Flask, flash,redirect, url_for, request, render_template, jsonify
import PostAppOperation
import mailInfo
from datetime import timedelta
from flask_mail import Mail, Message
from pymongo import MongoClient
import os
app = Flask(__name__)
mail=Mail(app)
Mailinfo = mailInfo.mailSetup();
app.config['MAIL_SERVER']=Mailinfo.mail_server
app.config['MAIL_PORT'] = Mailinfo.mail_port
app.config['MAIL_USERNAME'] = Mailinfo.username
app.config['MAIL_PASSWORD'] = Mailinfo.password
app.config['MAIL_USE_TLS'] = Mailinfo.TLS
app.config['MAIL_USE_SSL'] = Mailinfo.SSL
KEY = "postapptesting2017"
mail = Mail(app)

app.secret_key= 'postapptesting2017'

# @app.before_request
# def make_session_permanent():
#     session.permanent = True;
#     app.permanent_session_lifetime = timedelta(minutes =30);
#     # flash("The session has expired. Please log in to access PostApp.");

def sendEmailConfimation(name,username, receivers):
    msg = Message("Welcome to Post App", sender = mailInfo.mailSetup().username, recipients = [receivers]);
    msg.body = "Hello {}, thank you for joining Post App. Your username is {} and your KEY is {}.\
    Please keep this email as a record and use the KEY to complete your registration.\n\nSincerely,\nPost App".format(name, username, KEY);
    return msg;

def sendPassword(name, username, password, receivers):
    msg = Message("Welcome to Post App", sender = mailInfo.mailSetup().username, recipients = [receivers]);
    msg.body = "Hello {}, your username is {} and your password is {}. Please keep this email as a record and use the new password to access POST APP.\n\nSincerely,\nPost App".format(name, username, password);
    return msg;
def connect():
    connection = MongoClient("ds163294.mlab.com", 63294, tz_aware = True)
    handle = connection["post-app"]
    handle.authenticate("amynguyen", 'amynguyen')
    return handle
db = connect();

@app.route("/get_file/<filename>", methods=["POST"])
def get_file(filename):
    images_file = [];
    for filename1 in os.listdir(os.getcwd()+"/static/" + filename):
        a = url_for("static", filename=filename+"/" + filename1);
        images_file.append(a);
    return jsonify(result = images_file);


@app.route("/")
def main():
    username = "";
    if 'name' in session:
        username = session['name'];
    return render_template('main.html', username=username);

@app.route("/userRecover", methods=["POST", "GET"])
def userRecover():
    return render_template("userRecovery.html");

@app.route("/blog", methods=["POST", "GET"])
def blog():
    return render_template("blog.html");



@app.route("/emailConfirmation", methods=["POST", "GET"])
def emailConfirmation():
    return render_template("emailConfirm.html");


@app.route("/passwordRecovery", methods=["POST", "GET"])
def passwordRecovery():
    if request.method == "POST":
        username = request.form["username"];
        email = request.form["email"];
        result = db.user.find({"username":username});
        for item in result:
            message = sendPassword(item["name"],username, item["password"], email );
            mail.send(message);
            return redirect(url_for("main"));
    # return redirect(url_for("main"));

@app.route("/registration", methods=["POST", "GET"])
def registration():
    if request.method == "POST":
        name = request.form["name"];
        email = request.form["email"];
        username= request.form["username"];
        message = sendEmailConfimation(name, username, email);
        mail.send(message);
        return redirect(url_for('emailConfirmation'));
    # return redirect(url_for("emailConfirmation"));

@app.route("/register")
def register():
    return render_template("register.html");


if __name__ == '__main__':
    app.debug = True;
    app.run();
    app.run(debug = True);
