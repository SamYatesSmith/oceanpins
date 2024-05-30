from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import DiveLog, Dive
from django.contrib.auth.models import User

# Create your views here.

@csrf_exempt
def add_dive_log(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        dive_log = DiveLog(
            date=data['date'],
            name=data['name'],
            location=data['location'],
            buddy=data['buddy'],
            depth=data['depth'],
            temp=data['temp'],
            visibility=data['visibility'],
            bottom_time=data['bottomTime']
        )
        dive_log.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
def add_dive(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.first()  # Temporarily using the first user in the database
        dive = Dive(
            user=user,
            location=data['location'],
            date=data['date'],
            depth=data['depth'],
            buddy=data['buddy'],
            conditions=data['conditions'],
            photos=data.get('photos')  # Handling optional photos
        )
        dive.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)
