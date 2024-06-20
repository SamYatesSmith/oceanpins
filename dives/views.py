import json
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.http import require_POST
from .models import DiveLog

User = get_user_model()

# Helper function to close the database connection
def close_connection():
    from django.db import connection
    if connection.connection:
        connection.close()

@csrf_exempt
@login_required
@require_POST
def add_dive_log(request):
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
        return JsonResponse({'status': 'success'})
    except KeyError as e:
        return JsonResponse({'status': 'error', 'message': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    finally:
        close_connection()

@login_required
def home(request):
    return render(request, 'home.html')

@login_required
def interactive_map(request):
    dive_logs = DiveLog.objects.all().values('date', 'name', 'location', 'buddy', 'depth', 'temp', 'visibility', 'bottom_time', 'user_id')
    dive_logs_json = json.dumps(list(dive_logs), cls=DjangoJSONEncoder)

    return render(request, 'interactive_map.html', {
        'dive_logs': dive_logs_json
    })

@csrf_exempt
@login_required
def remove_dive_log(request):
    try:
        data = json.loads(request.body)
        location = data.get('location')
        user = request.user
        print(f"Received request to remove dive log at location: {location} for user: {user}")

        if not location:
            return JsonResponse({'status': 'error', 'message': 'Invalid data received'}, status=400)

        dive_log = DiveLog.objects.filter(location=location, user=user)
        print(f"Filtered dive logs: {list(dive_log)}")
        if dive_log.exists():
            dive_log.delete()
            print(f"Dive log at {location} removed.")
            return JsonResponse({'status': 'success'})
        else:
            print(f"Dive log at {location} not found.")
            return JsonResponse({'status': 'error', 'message': 'Dive log not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@login_required
def view_dive_logs(request):
    dive_logs = DiveLog.objects.all()
    data = [
        {'date': log.date, 'name': log.name, 'location': log.location, 'buddy': log.buddy,
         'depth': log.depth, 'temp': log.temp, 'visibility': log.visibility, 'bottom_time': log.bottom_time}
        for log in dive_logs
    ]
    return JsonResponse({'dive_logs': data})

@login_required
def get_most_common_buddy(request):
    most_common_buddy = (DiveLog.objects
                         .values('buddy')
                         .annotate(count=Count('buddy'))
                         .order_by('-count')
                         .first())
    buddy_name = most_common_buddy['buddy'] if most_common_buddy else ''
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
