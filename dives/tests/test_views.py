import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from dives.models import DiveLog
from profiles.models import Profile


class TestViews(TestCase):
    def setUp(self):
        self.client = Client()
        self.add_dive_log_url = reverse('add_dive_log')
        self.view_dive_logs_url = reverse('view_dive_logs')
        self.update_dive_log_url = reverse('update_dive_log')
        self.remove_dive_log_url = reverse('remove_dive_log')
        self.interactive_map_url = reverse('interactive_map')
        self.get_divelog_markers_url = reverse('get_divelog_markers')
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='password123'
        )
        self.profile = Profile.objects.create(user=self.user)
        self.client.login(username='testuser', password='password123')

    def test_add_dive_log_view(self):
        """
        Test POST request to the add_dive_log view.
        """
        response = self.client.post(self.add_dive_log_url, json.dumps({
            'date': '2024-08-01',
            'name': 'Test Dive',
            'location': '12.34,56.78',
            'buddy': 'Test Buddy',
            'depth': 30,
            'temp': 25,
            'visibility': 20,
            'bottom_time': 45
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_get_divelog_markers_view(self):
        """
        Test GET request to the get_divelog_markers view.
        """
        response = self.client.get(self.get_divelog_markers_url)
        self.assertEqual(response.status_code, 200)

    def test_interactive_map_view(self):
        """
        Test GET request to the interactive_map view.
        """
        response = self.client.get(self.interactive_map_url)
        self.assertEqual(response.status_code, 200)

    def test_remove_dive_log_view(self):
        """
        Test POST request to the remove_dive_log view.
        """
        dive_log = DiveLog.objects.create(
            user=self.user,
            date='2024-08-01',
            name='Test Dive',
            location='12.34,56.78',
            buddy='Test Buddy',
            depth=30,
            temp=25,
            visibility=20,
            bottom_time=45
        )
        response = self.client.post(self.remove_dive_log_url, json.dumps({
            'id': dive_log.id
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_update_dive_log_view(self):
        """
        Test POST request to the update_dive_log view.
        """
        dive_log = DiveLog.objects.create(
            user=self.user,
            date='2024-08-01',
            name='Test Dive',
            location='12.34,56.78',
            buddy='Test Buddy',
            depth=30,
            temp=25,
            visibility=20,
            bottom_time=45
        )
        response = self.client.post(self.update_dive_log_url, json.dumps({
            'id': dive_log.id,
            'date': '2024-08-02',
            'name': 'Updated Dive'
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_view_dive_logs_view(self):
        """
        Test GET request to the view_dive_logs view.
        """
        response = self.client.get(self.view_dive_logs_url)
        self.assertEqual(response.status_code, 200)
