from django.test import TestCase
from django.contrib.auth import get_user_model
from dives.models import DiveLog, Profile


class DiveLogModelTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='password123'
        )

    def test_dive_log_creation(self):
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
        self.assertEqual(str(dive_log), 'Test Dive')


class ProfileModelTest(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='password123'
        )
        self.profile = Profile.objects.create(user=self.user)

    def test_profile_creation(self):
        self.assertEqual(str(self.profile), 'testuser')
