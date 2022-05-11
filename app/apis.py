from json import loads as json_loads
from django.http import JsonResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.urls import reverse

from .models import User

def login(request):
    data = json_loads(request.body)
    username = data.get("username", "")
    password = data.get("password", "")

    if not User.objects.filter(username=username).exists():
        return JsonResponse({
            "error_message": "Invalid username.",
            "error_field": "username",
            "successful": False
        })

    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse({
            "error_message": "Incorrect password.",
            "error_field": "password",
            "successful": False
        })
        
    auth_login(request, user)

    return JsonResponse({
        "path": reverse("index"),
        "successful": True
    })


def register(request):
    data = json_loads(request.body)
    username = data.get("username", "")
    email = data.get("email", "")
    password = data.get("password", "")
    confirmation = data.get("confirmation", "")
    
    if len(password) < 8:
        return JsonResponse({
            "error_message": "Invalid password. Password must be at least 8 characters long.",
            "error_field": "password",
            "successful": False
        })

    if password != confirmation:
        return JsonResponse({
            "error_message": "Password must match.",
            "error_field": "confirmation",
            "successful": False
        })

    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return JsonResponse({
            "error_message": "Username already taken.",
            "error_field": "username",
            "successful": False
        })

    auth_login(request, user)

    return JsonResponse({
        "path": reverse("index"),
        "successful": True
    })


def logout(request):
    auth_logout(request)
    return JsonResponse({"path": reverse("login")})
