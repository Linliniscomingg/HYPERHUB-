from django.urls import path
from .views import *

urlpatterns = [
    path('insert-quizlet', QuizletsInsertView.as_view()),
    path('quiz/<int:id>', UserGetExamDetailView.as_view()),
    path('history/<int:id>', UserGetExamHistoryView.as_view()),
    path('getall', UserGetAllExamsView.as_view())
]