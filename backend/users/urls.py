from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegisterView.as_view()),
    path('profile/', views.UserProfileView.as_view()),
    path('change_password/', views.UserChangePasswordView.as_view()),
    path('send_reset_password_email/', views.SendResetPasswordEmailView.as_view()),
    path('reset_password/<int:uid>/<token>/', views.UserResetPasswordView.as_view()),

]

