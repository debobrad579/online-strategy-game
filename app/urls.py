from django.urls import path
from django.contrib import admin

from . import views
from . import apis

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("login", views.login, name="login"),
    path("register", views.register, name="register"),
    path("api/login", apis.login),
    path("api/register", apis.register),
    path("api/logout", apis.logout)
]