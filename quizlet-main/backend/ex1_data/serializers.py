from rest_framework import serializers
from .models import *

class QuizletsInsertSerializer(serializers.Serializer):
    quizlet_file = serializers.FileField()
    exam_num = serializers.IntegerField()
    question_num = serializers.IntegerField()

    class Meta:
        fields = ('quizlet_file', 'exam_num', 'question_num')

class UserGetExamDetailSerializer(serializers.Serializer):
    exam_name = serializers.CharField()

    class Meta:
        fields = ('exam_name')

class UserGetExamHistorySerializer(serializers.Serializer):
    exam_name = serializers.CharField()

    class Meta:
        fields = ('exam_name')

class QuizletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quizlets
        fields = ('question', 'answer_1', 'answer_2', 'answer_3', 'answer_4', 'correct_answer')