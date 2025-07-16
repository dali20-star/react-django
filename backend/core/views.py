from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def hello(request):
    return JsonResponse({"message": "Hello from Django!"})
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Django backend!")
