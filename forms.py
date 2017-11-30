from flask_wtf import Form
# from FlaskForm import Form
from wtforms import TextField, SubmitField, PasswordField, TextAreaField
from wtforms import validators, ValidationError


class RegistrationForm(Form):
    name = TextField("Name", [validators.Required("Please enter your full name")]);
    email = TextField("Email", [validators.Required("Please enter a valid email address"),
    validators.Email("Please enter your email address.")]);
    username = TextField("Username", [validators.Required("Your username should be at least 5 characters and\
    should not exceed 20 characters"),
    validators.Length(min=5, max=20,
    message="Your username should be at least 5 characters and\
    should not exceed 20 characters")]);
    password = PasswordField("Password", [validators.Required("Your password should be at least 5 characters and\
    should not exceed 20 characters"),
    validators.Length(min=5, max=20,
    message="Your password should be at least 5 characters and\
    should not exceed 20 characters")]);
    # key = PasswordField("Key",[validators.Required("Your key should be at least 10 characters and\
    # should not exceed 20 characters"),
    # validators.Length(min=10, max=20,
    # message="Your key should be at least 10 characters and\
    # should not exceed 20 characters")]);
    submit = SubmitField("Submit");

class LoginForm(Form):
    username = TextField("Username", [validators.Required("Your username should be at least 5 characters and\
    should not exceed 20 characters"),
    validators.Length(min=5, max=20,
    message="Your username should be at least 5 characters and\
    should not exceed 20 characters")]);
    password = PasswordField("Password", [validators.Required("Your password should be at least 5 characters and\
    should not exceed 20 characters"),
    validators.Length(min=5, max=20,
    message="Your password should be at least 5 characters and\
    should not exceed 20 characters")]);
    submit = SubmitField("Submit");

class PostForm(Form):
    post = TextAreaField("post");
    submit = SubmitField("Send");
