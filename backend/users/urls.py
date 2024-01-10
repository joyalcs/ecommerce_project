from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.UserRegisterView.as_view(), name="user-register"),
    path("profile/", views.UserProfileView.as_view(), name="user-profile"),
    path(
        "change_password/",
        views.UserChangePasswordView.as_view(),
        name="change-password",
    ),
    path(
        "send_reset_password_email/",
        views.SendResetPasswordEmailView.as_view(),
        name="reset-email",
    ),
    path(
        "reset_password/<int:uid>/<token>/",
        views.UserResetPasswordView.as_view(),
        name="reset-password",
    ),
]
