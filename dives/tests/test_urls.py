from django.test import SimpleTestCase
from django.urls import reverse, resolve
from dives import views


class TestUrls(SimpleTestCase):
    def test_home_url_is_resolved(self):
        """
        Test GET request to the home view.
        """
        url = reverse('home')
        self.assertEqual(resolve(url).func, views.home)

    def test_add_dive_log_url_is_resolved(self):
        """
        Test POST request to the add_dive_log view.
        """
        url = reverse('add_dive_log')
        self.assertEqual(resolve(url).func, views.add_dive_log)

    def test_view_dive_logs_url_is_resolved(self):
        """
        Test GET request to the view_dive_logs view.
        """
        url = reverse('view_dive_logs')
        self.assertEqual(resolve(url).func, views.view_dive_logs)

    def test_update_dive_log_url_is_resolved(self):
        """
        Test POST request to the update_dive_log view.
        """
        url = reverse('update_dive_log')
        self.assertEqual(resolve(url).func, views.update_dive_log)

    def test_remove_dive_log_url_is_resolved(self):
        """
        Test POST request to the remove_dive_log view.
        """
        url = reverse('remove_dive_log')
        self.assertEqual(resolve(url).func, views.remove_dive_log)

    def test_interactive_map_url_is_resolved(self):
        """
        Test GET request to the interactive_map view.
        """
        url = reverse('interactive_map')
        self.assertEqual(resolve(url).func, views.interactive_map)

    def test_get_divelog_markers_url_is_resolved(self):
        """
        Test GET request to the get_divelog_markers view.
        """
        url = reverse('get_divelog_markers')
        self.assertEqual(resolve(url).func, views.get_divelog_markers)
