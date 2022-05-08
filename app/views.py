from django.shortcuts import render, HttpResponseRedirect
from django.urls import reverse


def login(request):
    return render(request, "login.html")


def register(request):
    return render(request, "register.html")


def index(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))

    return render(request, "index.html")
