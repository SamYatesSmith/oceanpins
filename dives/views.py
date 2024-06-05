from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.db.models import Count
from .models import DiveLog, Dive
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView, LogoutView

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

@login_required
def home(request):
    return render(request, 'home.html')

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