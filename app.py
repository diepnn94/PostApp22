from forms import RegistrationForm
from forms import LoginForm
from forms import PostForm
from flask import session,Flask, flash,redirect, url_for, request, render_template
import PostAppOperation
import mailInfo
from flask_mail import Mail, Message
from pymongo import MongoClient

app = Flask(__name__)
mail=Mail(app)
Mailinfo = mailInfo.mailSetup();
app.config['MAIL_SERVER']=Mailinfo.mail_server
app.config['MAIL_PORT'] = Mailinfo.mail_port
app.config['MAIL_USERNAME'] = Mailinfo.username
app.config['MAIL_PASSWORD'] = Mailinfo.password
app.config['MAIL_USE_TLS'] = Mailinfo.TLS
app.config['MAIL_USE_SSL'] = Mailinfo.SSL
mail = Mail(app)

app.secret_key= 'postapptesting2017'
def connect():
    connection = MongoClient("ds163294.mlab.com", 63294)
    handle = connection["post-app"]
    handle.authenticate("amynguyen", 'amynguyen')
    return handle
db = connect();

@app.route("/")
def main():
    username = "";
    if 'name' in session:
        username = session['name'];
    return render_template('main.html', username=username);

@app.route("/logout")
def logout():
    if 'name' in session:
        session.pop('name', None)
    return redirect(url_for('main'));

@app.route("/blog", methods=["POST", "GET"])
def blog():
    if request.method == "GET" or request.method == "POST":
        if 'name' in session:
            post = PostForm();
            username = session['name'];
            response = PostAppOperation.postMessage(db,username, post.post.data );
            post = PostForm(formdata=None);
            messages = PostAppOperation.getMessage(db);
            return render_template("blog.html", username=username, form=post, messages = messages);
        else:
            flash("You need to log in/register to access Post App.");
            return redirect(url_for("main"));

@app.route("/emailConfirmation/<username>", methods =["POST", "GET"])
@app.route("/emailConfirmation", defaults={'username':None})
def emailConfirmation(username):
    if request.method == "GET":
        # if 'name' in session:
        #     username = session['name'];
        return render_template("emailConfirm.html", username = username);

    elif request.method == "POST":
        key = request.form['key'];
        response = PostAppOperation.confirmation(db,username, key);
        if response == "success":
            session['name'] = username;
            return redirect(url_for("blog"))
        elif response == "user error":
            flash("The username does not exist in our record. Please try again.");
            return redirect(url_for("account", option =  "login"));
        else:
            flash("The key entered is invalid. Please try again.")
            return redirect(url_for("emailConfirmation", username = username));


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        form = LoginForm();
        if form.validate_on_submit():
            username = form.username.data;
            password = form.password.data;
            response = PostAppOperation.login(db,username, password);
            if  response == "fail":
                flash("The information you had entered does not match our record. Please try again.")
                return render_template("account.html", option="login", form=form);
            elif response == "Confirm Key":
                return redirect(url_for('emailConfirmation', username = username));
            elif response == "success":
                session['name'] = username;
                post = PostForm();
                return redirect(url_for("blog"));
        else:
            return render_template("account.html", option="login", form=form);
    else:
        return redirect(url_for("account", option =  "login"));

@app.route("/registration", methods=["POST", "GET"])
def registration():
    if request.method == "POST":
        form = RegistrationForm();
        if form.validate_on_submit():
            name = form.name.data;
            email = form.email.data;
            username = form.username.data;
            password = form.password.data;
            response = PostAppOperation.inserttoDB(db,name, email, username, password);
            if response == "success":
                confirmMessage = PostAppOperation.sendEmailConfimation(name, username, email);
                mail.send(confirmMessage);
                return redirect(url_for('emailConfirmation', username = username));
            else:
                flash(response);
                return render_template("account.html", option="registration", form=form)

        else:
            flash("All fields are required.")
            return render_template("account.html", option="registration", form=form)
    else:
        return redirect(url_for("account", option="registration"));

@app.route("/account/<option>", methods=["POST", "GET"])
@app.route("/account", defaults={'option':None})
def account(option):
    if request.method == "POST":
        return redirect(url_for("main"));
    else:
        if option == "login":
            login= LoginForm()
            return render_template("account.html", option = option, form = login);
        else:
            registration = RegistrationForm();
            return render_template("account.html", option = option, form=registration);

if __name__ == '__main__':
    app.run();
