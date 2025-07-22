from django.db import models
from accounts.models import User

# Create your models here.
class Quizlets(models.Model):
    question = models.TextField(null=False, blank=False)
    answer_1 = models.TextField(null=False,blank=False)
    answer_2 = models.TextField(null=False,blank=False)
    answer_3 = models.TextField(null=False,blank=False)
    answer_4 = models.TextField(null=False,blank=False)
    correct_answer = models.TextField(null=False,blank=False)

class Exams(models.Model):
    name = models.CharField(unique=True, null=False, blank=False, max_length=50)
    display_name = models.CharField(null=False, blank=False, max_length=255)
    pass_score = models.IntegerField(null=False, blank=False, default=50)
    max_score = models.IntegerField(null=False, blank=False, default=100)
    duration = models.CharField(null=False, blank=False, default="00:60:00", max_length=25)
    number_questions = models.IntegerField(null=False, blank=False, default=60)
    created_at = models.DateTimeField(auto_now_add=True)

class ExamQuizlets(models.Model):
    exam = models.ForeignKey(Exams, on_delete=models.CASCADE)
    quizlet = models.ForeignKey(Quizlets, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class UserExams(models.Model):
    exam = models.ForeignKey(Exams, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.BooleanField(default=False, null=False,blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

class ExamsHistory(models.Model):
    user_exam = models.ForeignKey(UserExams, on_delete=models.CASCADE)
    practice = models.BooleanField(default=False, null=False,blank=False)
    correct_num = models.IntegerField(null=False, blank=False)
    total_num = models.IntegerField(null=False, blank=False)
    tested_at = models.DateTimeField(auto_now_add=True)
