from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
from .models import DiveLog, Dive
from django.contrib.auth import get_user_model

# Create your views here.
User = get_user_model()

@csrf_exempt
def add_dive_log(request):
    if request.method == 'POST':
        try:
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
        except KeyError as e:
            return JsonResponse({'status': 'error', 'message': f'Missing key: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def add_dive(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = User.objects.first()
            dive = Dive(
                user=user,
                location=data['location'],
                date=data['date'],
                depth=data['depth'],
                buddy=data['buddy'],
                conditions=data['conditions'],
                photos=data.get('photos')
            )
            dive.save()
            return JsonResponse({'status': 'success'})
        except KeyError as e:
            return JsonResponse({'status': 'error', 'message': f'Missing key: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
