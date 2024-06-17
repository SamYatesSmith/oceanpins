import json
from django.core.serializers.json import DjangoJSONEncoder 
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.db.models import Count
from .models import DiveLog, Dive, Marker
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView, LogoutView
from django.views.decorators.http import require_POST
from django.db import connection

User = get_user_model()

CACHE = {
    'markers': [],
    'dive_logs': []
}

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
                bottom_time=data['bottomTime'],
                user=request.user
            )
            dive_log.save()
            CACHE['dive_logs'].append({
                'date': data['date'],
                'name': data['name'],
                'location': data['location'],
                'buddy': data['buddy'],
                'depth': data['depth'],
                'temp': data['temp'],
                'visibility': data['visibility'],
                'bottom_time': data['bottomTime'],
                'user_id': request.user.id
            })
            return JsonResponse({'status': 'success'})
        except KeyError as e:
            return JsonResponse({'status': 'error', 'message': f'Missing key: {str(e)}'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        finally:
            if connection.connection:
                connection.close()
    else:
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
        finally:
            if connection.connection:
                connection.close()
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@login_required
def home(request):
    return render(request, 'home.html')

@login_required
def interactive_map(request):
    # Fetch markers and dive logs from the database if not already in the cache
    if not CACHE['markers']:
        markers = Marker.objects.all().values('lat', 'lng', 'user_id')
        CACHE['markers'] = list(markers)
    
    if not CACHE['dive_logs']:
        dive_logs = DiveLog.objects.all().values('date', 'name', 'location', 'buddy', 'depth', 'temp', 'visibility', 'bottom_time', 'user_id')
        CACHE['dive_logs'] = list(dive_logs)

    markers_json = json.dumps(CACHE['markers'], cls=DjangoJSONEncoder)
    dive_logs_json = json.dumps(CACHE['dive_logs'], cls=DjangoJSONEncoder)

    return render(request, 'interactive_map.html', {
        'markers': markers_json,
        'dive_logs': dive_logs_json
    })

@require_POST
@login_required
@csrf_exempt
def add_marker(request):
    try:
        data = json.loads(request.body)
        marker = {'lat': data['lat'], 'lng': data['lng'], 'user': request.user.id}

        if marker not in CACHE['markers']:
            CACHE['markers'].append(marker)
            Marker.objects.create(lat=data['lat'], lng=data['lng'], user=request.user)

        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def view_dive_logs(request):
    dive_logs = DiveLog.objects.all()
    data = [{'date': log.date, 'name': log.name, 'location': log.location, 'buddy': log.buddy,
             'depth': log.depth, 'temp': log.temp, 'visibility': log.visibility, 'bottom_time': log.bottom_time} for log in dive_logs]
    return JsonResponse({'dive_logs': data})

def view_dives(request):
    dives = Dive.objects.all()
    data = [{'location': dive.location, 'date': dive.date, 'depth': dive.depth, 'buddy': dive.buddy,
             'conditions': dive.conditions, 'photos': dive.photos.url if dive.photos else None} for dive in dives]
    return JsonResponse({'dives': data})

def get_most_common_buddy(request):
    most_common_buddy = (DiveLog.objects
                         .values('buddy')
                         .annotate(count=Count('buddy'))
                         .order_by('-count')
                         .first())
    if (most_common_buddy):
        buddy_name = most_common_buddy['buddy']
    else:
        buddy_name = ''
    
    return JsonResponse({'most_common_buddy': buddy_name})

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'profiles/signup.html', {'form': form})

def login_signup_choice(request):
    return render(request, 'profiles/login_signup_choice.html')
