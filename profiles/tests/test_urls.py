from django.test import SimpleTestCase
from django.urls import reverse, resolve
from profiles.views import CustomLoginView, register, profile, profile_setup, profile_picture_upload

class TestUrls(SimpleTestCase):
    """
    Test suite for the Profiles application's URL routing.
    """

    def test_login_url_is_resolved(self):
        """
        Test that the login URL is correctly routed to the CustomLoginView.
        """
        url = reverse('login')
        self.assertEqual(resolve(url).func.view_class, CustomLoginView)

    def test_register_url_is_resolved(self):
        """
        Test that the register URL is correctly routed to the register view.
        """
        url = reverse('register')
        self.assertEqual(resolve(url).func, register)

    def test_profile_url_is_resolved(self):
        """
        Test that the profile URL is correctly routed to the profile view.
        """
        url = reverse('profile')
        self.assertEqual(resolve(url).func, profile)

    def test_profile_setup_url_is_resolved(self):
        """
        Test that the profile-setup URL is correctly routed to the profile_setup view.
        """
        url = reverse('profile_setup')
        self.assertEqual(resolve(url).func, profile_setup)

    def test_profile_picture_upload_url_is_resolved(self):
        """
        Test that the profile-picture-upload URL is correctly routed to the profile_picture_upload view.
        """
        url = reverse('profile_picture_upload')
        self.assertEqual(resolve(url).func, profile_picture_upload)