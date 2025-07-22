from django.shortcuts import render
import math
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import *
from .serializers import *
from utils import excel_handler

# Create your views here.
class QuizletsInsertView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = QuizletsInsertSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        quizlet_file = serializer.data.get('quizlet_file')
        exam_num = serializer.data.get('exam_num')
        question_num = serializer.data.get('question_num')

        quizlets_info = self.handle_quizlets(file=quizlet_file)
        # save quizlets to database, return id of quizlet

        # make exam from quizlet id

        # save exam quizlet to database

    def handle_quizlets(self, file: str):
        # define custom header if possible
        result = excel_handler.read_excel(file)
        return result

class ExamsGenerationView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        pass

class UserGetExamDetailView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.Serializer

    def get(self, request, id, format=None):
        # for testing
        data = dict()
        data['status'] = True
        data['id'] = 1
        data['display_name'] = 'De Thi 01'
        data['pass_score'] = 50
        data['max_score'] = 100
        data['duration'] = '00:60:00'
        data['number_questions'] = 2
        questions = list()
        ques1 = dict()
        ques2 = dict()
        ques1['id'] = 1
        ques1['question'] = 'Hello hallo world.....'
        ques1['options'] = ['A. Hello', 'B. Hi', 'C. Xin chao', 'D. Bye bye']
        ques1['answers'] = ['A. Hello']
        ques1['type'] = "single"
    
        ques2['id'] = 2
        ques2['question'] = 'Hello hallo world.....'
        ques2['options'] = ['A. Hello', 'B. Hi', 'C. Xin chao', 'D. Bye bye']
        ques2['answers'] = ['B. Hi']
        ques2['type'] = "single"
        questions.append(ques1)
        questions.append(ques2)
        data['questions']= questions

        return Response(data=data, status=status.HTTP_200_OK)

        if (id is None) or (id < 0):
            return Response(data={'Id is invalid!!!'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data = dict()
            user_exam = UserExams.objects.get(id=id)
            exam = user_exam.exam
            data['status'] = user_exam.status
            data['id'] = exam.id
            data['display_name'] = exam.display_name
            data['pass_score'] = exam.pass_score
            data['max_score'] = exam.max_score
            data['duration'] = exam.duration
            data['number_questions'] = exam.number_questions
            questions = list()
            querySet = ExamQuizlets.objects.filter(exam=exam)
            if not querySet.exists():
                data['questions'] = questions
                return Response(data=data, status=status.HTTP_200_OK)
            for idx in range(len(querySet)):
                quizlet = querySet[idx].quizlet
                questions.append(QuizletSerializer(quizlet).data)
            data['questions'] = questions
            return Response(data=data, status=status.HTTP_200_OK)
        except Exception as err:
            print(err)
            return Response(data={'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
class UserGetAllExamsView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.Serializer

    def get(self, request, format=None):
        # just for testing
        data = list()
        item1 = dict()
        item1['id'] = 1
        item1['exam_name'] = 'dethi01'
        item1['exam_display_name'] = 'De Thi 01'
        item1['status'] = False
        item1['pass_score'] = 5
        item1['max_score'] = 10
        item1['duration'] = '00:60:00'
        item1['created_at'] = '2024-08-11'

        item2 = dict()
        item2['id'] = 2
        item2['exam_name'] = 'dethi02'
        item2['exam_display_name'] = 'De Thi 02'
        item2['status'] = True
        item2['pass_score'] = 6
        item2['max_score'] = 10
        item2['duration'] = '00:60:00'
        item2['created_at'] = '2024-08-10'

        data.append(item1)
        data.append(item2)
        return Response(data=data, status=status.HTTP_200_OK)

        current_user = request.user
        querySet = UserExams.objects.filter(user=current_user)
        if not querySet.exists():
            return Response(data={'Not found exams for current user'}, status=status.HTTP_404_NOT_FOUND)
        data = list()
        for idx in range(len(querySet)):
            user_exam = querySet[idx]
            exam = user_exam.exam
            item = dict()
            item['id'] = user_exam.id
            item['exam_name'] = exam.name
            item['exam_display_name'] = exam.display_name
            item['status'] = user_exam.status
            item['pass_score'] = exam.pass_score
            item['max_score'] = exam.max_score
            item['duration'] = exam.duration
            item['created_at'] = user_exam.created_at
            data.append(item)
        return Response(data=data, status=status.HTTP_200_OK)

class UserGetExamHistoryView(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.Serializer

    def get(self, request, id, format=None):
        # # just for testing
        # data = list()
        item1 = dict()
        item1['id'] = 1
        # item1['exam_name'] = 'dethi01'
        item1['exam_display_name'] = 'De Thi 01'
        # item1['practice'] = False
        # item1['correct_num'] = 0
        # item1['total_num'] = 60
        item1['pass_score'] = 5
        item1['max_score'] = 10
        item1['duration'] = 60
        # item1['tested_at'] = None

        # item2 = dict()
        # item2['id'] = 2
        # # item2['exam_name'] = 'dethi02'
        # item2['exam_display_name'] = 'De Thi 02'
        # # item2['practice'] = True
        # # item2['correct_num'] = 50
        # # item2['total_num'] = 60
        # # item2['score'] = math.floor(50*10/60)
        # item2['pass_score'] = 5
        # item2['max_score'] = 10
        # item2['duration'] = '00:60:00'
        # # item2['tested_at'] = '2024-08-10'

        # data.append(item1)
        # data.append(item2)
        return Response(data=item1, status=status.HTTP_200_OK)

        if (id is None) or (id < 0):
            return Response(data={'Id is invalid!!!'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data = list()
            user_exam = UserExams.objects.get(id=id)
            querySet = ExamsHistory.objects.filter(user_exam=user_exam)
            if not querySet.exists():
                return Response(data=data, status=status.HTTP_200_OK)
            for idx in range(len(querySet)):
                exam_history = querySet[idx]

        except UserExams.DoesNotExist as error:
            print(error)
            return Response(data={'Not found exam for current user'}, status=status.HTTP_404_NOT_FOUND)

        current_user = request.user
        querySet = ExamsHistory.objects.filter(user=current_user)
        if not querySet.exists():
            return Response(data={'Not found exams for current user'}, status=status.HTTP_404_NOT_FOUND)
        data = list()
        for idx in range(len(querySet)):
            exam_history = querySet[idx]
            item =dict()
            item['exam_name'] = exam_history.exam.name
            item['exam_display_name'] = exam_history.exam.display_name
            item['practice'] = exam_history.practice
            item['correct_num'] = exam_history.correct_num
            item['total_num'] = exam_history.total_num
            item['score'] = (exam_history.correct_num/exam_history.total_num)*10
            item['tested_at'] = exam_history.tested_at

            data.append(item)

        return Response(data=data, status=status.HTTP_200_OK)
