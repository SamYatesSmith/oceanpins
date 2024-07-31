import os
import json
import asyncio
from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.http import require_POST
from django.template.loader import render_to_string
from django.conf import settings
from .models import DiveLog
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@login_required
def get_divelog_markers(request):
    user = request.user
    divelogs = DiveLog.objects.filter(user=user).values('location')
    markers = [{"lat": float(dive['location'].split(',')[0]), "lng": float(dive['location'].split(',')[1])} for dive in divelogs if dive['location']]
    return JsonResponse(markers, safe=False)


@login_required
def profile_view(request):
    print(f"User: {request.user}")
    return render(request, 'profile.html')


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
        datetime.strptime(data['date'], '%Y-%m-%d')
        dive_log = DiveLog(
            date=data['date'],
            name=data['name'],
            location=data['location'],
            buddy=data['buddy'],
            depth=data['depth'],
            temp=data['temp'],
            visibility=data['visibility'],
            bottom_time=data['bottom_time'],
            user=request.user
        )
        dive_log.save()

        return JsonResponse({'status': 'success', 'dive_log': dive_log.id})
    except KeyError as e:
        return JsonResponse({'status': 'error', 'message': f'Missing key: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    finally:
        close_connection()


def home(request):
    return render(request, 'home.html')


@login_required
def interactive_map(request):
    user = request.user
    dive_logs = DiveLog.objects.filter(user=user).values(
        'date', 'name', 'location', 'buddy', 'depth', 'temp', 'visibility', 'bottom_time', 'user_id'
        )
    dive_logs_json = json.dumps(list(dive_logs), cls=DjangoJSONEncoder)
    logger.debug("Dive logs being passed to the template: %s", dive_logs_json)

    return render(request, 'interactive_map.html', {
        'dive_logs': dive_logs_json,
    })


@csrf_exempt
@login_required
def update_dive_log(request):
    try:
        data = json.loads(request.body)
        dive_log_id = data.get('id')
        if not dive_log_id:
            return JsonResponse({'status': 'error', 'message': 'Invalid data received: Missing ID'}, status=400)

        dive_log = DiveLog.objects.get(id=dive_log_id, user=request.user)
        dive_log.date = data.get('date', dive_log.date)
        dive_log.name = data.get('name', dive_log.name)
        dive_log.location = data.get('location', dive_log.location)
        dive_log.buddy = data.get('buddy', dive_log.buddy)
        dive_log.depth = data.get('depth', dive_log.depth)
        dive_log.temp = data.get('temp', dive_log.temp)
        dive_log.visibility = data.get('visibility', dive_log.visibility)
        dive_log.bottom_time = data.get('bottomTime', dive_log.bottom_time)
        dive_log.save()

        return JsonResponse({'status': 'success'})
    except DiveLog.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Dive log not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
@login_required
def remove_dive_log(request):
    try:
        data = json.loads(request.body)
        dive_log_id = data.get('id')
        user = request.user

        if not dive_log_id:
            return JsonResponse({'status': 'success', 'message': 'Marker without ID removed successfully'})

        dive_log = DiveLog.objects.filter(id=dive_log_id, user=user)
        if dive_log.exists():
            dive_log.delete()
            return JsonResponse({'status': 'success'})
        else:
            print(f"Dive log with id {dive_log_id} not found.")
            return JsonResponse({'status': 'error', 'message': 'Dive log not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@login_required
def view_dive_logs(request):
    dive_logs = DiveLog.objects.filter(user=request.user)
    data = [
        {
            'id': log.id,
            'date': log.date,
            'name': log.name,
            'location': log.location,
            'buddy': log.buddy,
            'depth': log.depth,
            'temp': log.temp,
            'visibility': log.visibility,
            'bottom_time': log.bottom_time
        }
        for log in dive_logs
    ]
    return JsonResponse({'dive_logs': data})


def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your account has been created successfully. Please log in.')
            return redirect('login')
        else:
            for field in form:
                for error in field.errors:
                    messages.error(request, f"{field.label}: {error}")
            for error in form.non_field_errors():
                messages.error(request, error)
    else:
        form = UserCreationForm()
    return render(request, 'profiles/signup.html', {'form': form})


def login_signup_choice(request):
    return render(request, 'profiles/login_signup_choice.html')


@login_required
def profile_view(request):
    dive_logs = DiveLog.objects.filter(user=request.user).exclude(location__isnull=True).exclude(location__exact='').values('location')
    dive_logs_list = list(dive_logs)
    
    logger.info("Dive logs being passed to template: %s", dive_logs_list)
    
    dive_logs_json = json.dumps(dive_logs_list, cls=DjangoJSONEncoder)
    
    return render(request, 'profile.html', {
        'dive_logs': dive_logs_json,
    })