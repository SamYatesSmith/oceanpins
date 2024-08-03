from django.test import TestCase
from profiles.forms import CustomUserCreationForm, ProfileForm, DiveForm
from profiles.models import CustomUser


class TestForms(TestCase):
    """
    Test suite for the application's forms.
    """

    def test_custom_user_creation_form_valid_data(self):
        """
        Test CustomUserCreationForm with valid data.
        """
        form = CustomUserCreationForm(data={
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'profile_pic': None,
            'password1': 'Testpass123!',
            'password2': 'Testpass123!'
        })

        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')

    def test_custom_user_creation_form_invalid_data(self):
        """
        Test CustomUserCreationForm with invalid data.
        """
        form = CustomUserCreationForm(data={})

        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)
        self.assertIn('email', form.errors)
        self.assertIn('first_name', form.errors)
        self.assertIn('last_name', form.errors)
        self.assertIn('password1', form.errors)
        self.assertIn('password2', form.errors)


def test_profile_form_valid_data(self):
    """
    Test ProfileForm with valid data.
    """
    user = CustomUser.objects.create_user(
        username='testuser',
        password='password123'
    )
    form = ProfileForm(data={
        'dive_school': 'Test Dive School',
        'cert_level': 'Advanced',
        'fav_dive_site': 'Great Barrier Reef',
        'next_dive_trip_date': '2024-08-01',
        'next_dive_location': 'Bali',
        'training_location': 'Sydney',
        'biography': 'Loves diving!',
        'profile_pic': None,
    })

    form.instance.user = user
    self.assertTrue(form.is_valid())


def test_profile_form_invalid_data(self):
    """
    Test ProfileForm with invalid data.
    """
    form = ProfileForm(data={})
    self.assertFalse(form.is_valid())
    self.assertIn('dive_school', form.errors)
    self.assertIn('cert_level', form.errors)
    self.assertIn('fav_dive_site', form.errors)
    self.assertIn('next_dive_trip_date', form.errors)
    self.assertIn('next_dive_location', form.errors)
    self.assertIn('training_location', form.errors)
    self.assertIn('biography', form.errors)


def test_dive_form_valid_data(self):
    """
    Test DiveForm with valid data.
    """
    user = CustomUser.objects.create_user(
        username='testuser',
        password='password123'
    )
    form = DiveForm(data={
        'title': 'Test Dive',
        'description': 'A test dive description.',
        'image': None
    })

    form.instance.user = user
    self.assertTrue(form.is_valid())

    def test_dive_form_invalid_data(self):
        """
        Test DiveForm with invalid data.
        """
        form = DiveForm(data={})

        self.assertFalse(form.is_valid())
        self.assertIn('title', form.errors)
        self.assertIn('description', form.errors)
        self.assertIn('image', form.errors)
