from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from profiles.models import Profile


class TestViews(TestCase):
    """
    Test suite for the profiles views.
    """

    def setUp(self):
        """
        Set up the test client and initialize the URLs and a test user.
        """
        self.client = Client()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.profile_setup_url = reverse('profile_setup')
        self.profile_url = reverse('profile')
        self.profile_picture_upload_url = reverse('profile_picture_upload')
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='password123'
        )
        Profile.objects.create(user=self.user)
        self.client.login(username='testuser', password='password123')

    def test_register_view_GET(self):
        """
        Test GET request to the register view.
        """
        response = self.client.get(self.register_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'profiles/register.html')

    def test_register_view_POST(self):
        """
        Test POST request to the register view.
        """
        response = self.client.post(self.register_url, {
            'username': 'testuser2',
            'email': 'test2@example.com',
            'first_name': 'Test2',
            'last_name': 'User2',
            'password1': 'Testpass123!',
            'password2': 'Testpass123!'
        })
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('profile_setup'))

    def test_profile_setup_view_GET(self):
        """
        Test GET request to the profile setup view.
        """
        response = self.client.get(self.profile_setup_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'profiles/profile_setup.html')

    def test_profile_setup_view_POST(self):
        """
        Test POST request to the profile setup view.
        """
        response = self.client.post(self.profile_setup_url, {
            'dive_school': 'PADI',
            'cert_level': 'Advanced',
            'fav_dive_site': 'Great Barrier Reef',
            'next_dive_trip_date': '2024-08-01',
            'next_dive_location': 'Bali',
            'training_location': 'Sydney',
            'biography': 'Loves diving!',
            'profile_pic': ''
        })
        if response.context and 'form' in response.context:
            print(response.context['form'].errors)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.profile_url)

    def test_profile_view_GET(self):
        """
        Test GET request to the profile view.
        """
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'profiles/profile.html')

    def test_profile_view_POST(self):
        """
        Test POST request to the profile view.
        """
        response = self.client.post(self.profile_url, {
            'dive_school': 'PADI',
            'cert_level': 'Advanced',
            'fav_dive_site': 'Great Barrier Reef',
            'next_dive_trip_date': '2024-08-01',
            'next_dive_location': 'Bali',
            'training_location': 'Sydney',
            'biography': 'Loves diving!',
            'profile_pic': ''
        })
        if response.context and 'form' in response.context:
            print(response.context['form'].errors)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.profile_url)

    def test_profile_picture_upload_view_GET(self):
        """
        Test GET request to the profile picture upload view.
        """
        response = self.client.get(self.profile_picture_upload_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'profiles/profile.html')

    def test_profile_picture_upload_view_POST(self):
        """
        Test POST request to the profile picture upload view.
        """
        response = self.client.post(self.profile_picture_upload_url, {
            'dive_school': 'PADI',
            'cert_level': 'Advanced',
            'fav_dive_site': 'Great Barrier Reef',
            'next_dive_trip_date': '2024-08-01',
            'next_dive_location': 'Bali',
            'training_location': 'Sydney',
            'biography': 'Loves diving!',
            'profile_pic': ''
        })
        if response.context and 'form' in response.context:
            print(response.context['form'].errors)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, self.profile_url)
