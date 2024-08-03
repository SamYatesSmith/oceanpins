from django.test import TestCase
from django.contrib.auth import get_user_model
from profiles.models import Profile, Dive
from datetime import date
from unittest.mock import patch, PropertyMock


class CustomUserModelTest(TestCase):
    """
    Test suite for the CustomUser model.
    """
    def setUp(self):
        """
        Set up a test user for CustomUser model tests.
        """
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='12345',
            bio='Test bio'
        )

    def test_user_creation(self):
        """
        Test that the user is created with the correct username and bio.
        """
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.bio, 'Test bio')

    def test_profile_property(self):
        """
        Test that the profile property correctly returns the
        related Profile instance.
        """
        profile = Profile.objects.create(
            user=self.user,
            dive_school=Profile.PADI
        )
        self.assertEqual(self.user.profile, profile)


class ProfileModelTest(TestCase):
    """
    Test suite for the Profile model.
    """
    def setUp(self):
        """
        Set up a test user and profile for Profile model tests.
        """
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='12345'
        )
        self.profile = Profile.objects.create(
            user=self.user,
            dive_school='PADI',
            cert_level='Advanced',
            fav_dive_site='Great Barrier Reef',
            next_dive_trip_date=date(2024, 12, 1),
            next_dive_location='Hawaii',
            training_location='Australia',
            biography='Loves underwater photography'
        )

    def test_profile_creation(self):
        """
        Test that the profile is created with the correct attributes.
        """
        self.assertEqual(self.profile.user.username, 'testuser')
        self.assertEqual(self.profile.dive_school, 'PADI')
        self.assertEqual(self.profile.cert_level, 'Advanced')
        self.assertEqual(self.profile.fav_dive_site, 'Great Barrier Reef')
        self.assertEqual(
            self.profile.next_dive_trip_date.strftime('%Y-%m-%d'),
            '2024-12-01'
        )
        self.assertEqual(self.profile.next_dive_location, 'Hawaii')
        self.assertEqual(self.profile.training_location, 'Australia')
        self.assertEqual(
            self.profile.biography,
            'Loves underwater photography'
        )
        self.assertEqual(
            self.profile.profile_pic,
            'https://res.cloudinary.com/dt6dg1u1o/image/upload/v1716999970/static/images/user_default.png'
        )

    def test_profile_str(self):
        """
        Test the string representation of the profile.
        """
        self.assertEqual(str(self.profile), "testuser's Profile")


class DiveModelTest(TestCase):
    """
    Test suite for the Dive model.
    """
    def setUp(self):
        """
        Set up a test user and dive for Dive model tests.
        """
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='12345'
        )
        self.dive = Dive.objects.create(
            title='Test Dive',
            description='Test Description',
            image='path/to/image'
        )

    @patch('profiles.models.Dive.image', new_callable=PropertyMock)
    def test_dive_creation(self, mock_image):
        """
        Test that the dive is created with the correct attributes and
        mock the image URL.
        """
        mock_image.return_value.url = (
            'https://res.cloudinary.com/dt6dg1u1o/image/upload/v1716999970/'
            'static/images/dive_default.png'
        )

        self.assertEqual(self.dive.title, 'Test Dive')
        self.assertEqual(self.dive.description, 'Test Description')
        self.assertEqual(self.dive.image.url, mock_image.return_value.url)

    def test_dive_str(self):
        """
        Test the string representation of the dive.
        """
        self.assertEqual(str(self.dive), 'Test Dive')
