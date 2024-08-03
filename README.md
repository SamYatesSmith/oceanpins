# Ocean Pins    

<img src="./media/readme.images/oceanPinsLogo.png" alt="Ocean Pins Logo" width="300" height="300">


## Introduction
- Ocean Pins is a scuba diving log app.  A basic sign-up and login system allows users to save their changes when adding 'pins' to an interactive map.  These pins are fully viewable, usable, editable and deletable and allow an overview of the individuals diving experience. 
- The editable pins a user can add to their personal map, emulate the physical "logbook" entries every diver receives once they complete their "Open Water" certification, and start diving with a certified school.  The dive entries within ones logbook is what Ocean Pins is designed to digitise.


## Table of Contents

1. [Introduction](#introduction)
2. [Table of Contents](#table-of-contents)
3. [Features](#features)
4. [Feature Screenshots](#feature-screenshots)
5. [Core Languages Used](#core-languages-used)
6. [Technologies Used](#technologies-used)
7. [Architecture](#architecture)
8. [Installation](#installation)
9. [Database Models](#database-models)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Design](#design)
13. [Sequence Diagrams](#sequence-diagrams)
14. [Wireframes](#wireframes)
15. [User Stories](#user-stories)
16. [Future Developments](#future-developments)
17. [Code Validation](#code-validation)
18. [Troubleshooting](#troubleshooting)
19. [Contributors](#contributors)


## Features

### Profiles
> - Registration for new users
> - Login / SignUp integration
> - Editable capture of details realting to the divers experience
> - Stored, editable information relating to the user
> - Ability to add a photo to ones profile, and to change this picture at their leisure
> - A read only digital screenshot of a users Interactive Map.  This allows a brief overview of how the users dive map looks. 
> - Inter page navigation

### Interactive Map
> - Map help for when a user first cvisits the page and nedd instructions on how the map is designed to work. 
> - Interactive Map.  Google maps API that has been modified to allow a user to add pins in the locations they have dived. 
> - The pins offer the following interactivity:
>   * Create / add marker
>   * Edit
>   * Remove / Delete
>   * Hover: Hover over a marker to read its details
>   * Clusters: Automatically creates marker clusters when the user has more than one dive in close proximity and they zoom out on the map
> - Map Tools.  These automatically appear based o nthe users interaction with the map.  Otherwise, the area in which they appear is a pleasant themed image

### Home
> - Fully responsive navbar
> - Hamburger menu at smaller screen sizes
> - Wavy text set to a timer to add appeal
> - Hover login and signup effects encourage user to click
> - Interactive social media links
> - Logo a home link
> - Login/Signup logged in indicator

### General 
> - Fully navigable
> - Set pages for each required page interaction
> - CSRF tokens
> - Enticing, colourful backdrops and images
> - Consistent styling and fonts


## Feature Screenshots

 - Home;

 ![Home page](./media/readme.images/home.screenshot.png)

 - Login;

 ![Login page](./media/readme.images/login.screenshot.png)

 - Register;

 ![Registration/Signup page](./media/readme.images/register.screenshot.png)

 - Login Or Register choice;

 ![Login Or Register page](./media/readme.images/login.or.signup.screenshot.png)

 - Interactive Map;

 ![Interactive map page](./media/readme.images/interactive.map.screenshot.png)

 - Map Help button activation

  ![Map Help view](./media/readme.images/map.help.screenshot.png)

 - Map Tools;

  ![Map tools activated](./media/readme.images/map.tools.screenshot.png)

 - Dive Profile;

  ![Dive Profile page](./media/readme.images/dive.profile.screenshot.png)

  - Read Only map snapshot;

  ![Dive Map Snapshot](./media/readme.images/map.snapshot.screenshot.png)


## Core Languages Used

- **Python 3.12.2**: Backend development with Django.
- **JavaScript (ES6)**: Client-side scripting / front-end functionality.
- **HTML5**: Structuring the web pages.
- **CSS3**: Styling the web pages.
- **jQuery 3.6.0**: JavaScript library.
- **Bootstrap 4.6.0**: Front-end framework
- **Jinja2 3.1.2**: Templating engine for Python.

## Technologies Used

### Frameworks and Libraries
- **Django 3.2.25**: Python web framework
- **Cloudinary 1.40.0**: Cloud-based image and video management service.
- **Gunicorn 22.0.0**: Python WSGI HTTP Server

### Database
- **PostgreSQL (via Psycopg2 2.9.9)**: Open-source object-relational database system. `psycopg2` as the adapter for Python.

### Utilities
- **ASGI (via Asgiref 3.8.1)**: Asynchronous Server Gateway Interface.
- **Dj-Database-URL 0.5.0**: Allows the use of `DATABASE_URL` environment variable to configure the database in Django.
- **Django-Environ 0.11.2**: Django package for environment variables.
- **Pytz 2024.1**: World Timezone Definitions.
- **Sqlparse 0.5.0**: A non-validating SQL parser for Python.
- **Urllib3 1.26.15**: HTTP client for Python.

### Image Processing
- **Pillow 10.3.0**: The Python Imaging Library

### Testing
- **Pytest**: Test framework.
- **Node.js**: Managing JavaScript test dependencies (via `node_modules`).

### Configuration Management
- **Environ**: Managing environment variables

### Miscellaneous
- **Staticfiles**: For managing static files like CSS, JavaScript, and images in a Django project.


### Configuration Management
- **Environ**: Used for managing environment variables in a Django project.

### Miscellaneous
- **Node.js**: For managing JavaScript dependencies (via `node_modules`).
- **Staticfiles**: For managing static files like CSS, JavaScript, and images in a Django project.


## Architecture

The project follows a Model-View-Controller (MVC) architecture, organizing the code into three interconnected components: models, views, and controllers.

### ERD Structure

```plaintext
.
├── db_backup.sqlite3
├── db.sqlite3
├── dive_proj
│   ├── asgi.py
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── celery.cpython-312.pyc
│   │   ├── __init__.cpython-312.pyc
│   │   ├── settings.cpython-312.pyc
│   │   ├── urls.cpython-312.pyc
│   │   └── wsgi.cpython-312.pyc
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── dives
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_marker.py
│   │   ├── 0003_auto_20240619_1628.py
│   │   ├── 0004_auto_20240620_1103.py
│   │   ├── 0005_profile.py
│   │   ├── 0006_alter_profile_user.py
│   │   ├── 0007_profile_map_snapshot_url.py
│   │   ├── 0008_remove_profile_map_snapshot_url.py
│   │   ├── __init__.py
│   │   └── __pycache__
│   │       ├── 0001_initial.cpython-312.pyc
│   │       ├── 0002_divelog.cpython-312.pyc
│   │       ├── 0002_initial.cpython-312.pyc
│   │       ├── 0002_marker.cpython-312.pyc
│   │       ├── 0003_auto_20240619_1628.cpython-312.pyc
│   │       ├── 0003_divelog_user.cpython-312.pyc
│   │       ├── 0004_assign_default_users.cpython-312.pyc
│   │       ├── 0004_auto_20240620_1103.cpython-312.pyc
│   │       ├── 0005_profile.cpython-312.pyc
│   │       ├── 0006_alter_profile_user.cpython-312.pyc
│   │       ├── 0007_profile_map_snapshot_url.cpython-312.pyc
│   │       ├── 0008_remove_profile_map_snapshot_url.cpython-312.pyc
│   │       └── __init__.cpython-312.pyc
│   ├── models.py
│   ├── __pycache__
│   │   ├── admin.cpython-312.pyc
│   │   ├── apps.cpython-312.pyc
│   │   ├── __init__.cpython-312.pyc
│   │   ├── models.cpython-312.pyc
│   │   ├── tasks.cpython-312.pyc
│   │   ├── urls.cpython-312.pyc
│   │   └── views.cpython-312.pyc
│   ├── templates
│   │   └── dive_pages
│   │       ├── dive_form.html
│   │       ├── dive.html
│   │       └── gallery.html
│   ├── tests
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   │   ├── __init__.cpython-312.pyc
│   │   │   ├── test_models.cpython-312.pyc
│   │   │   ├── test_models.cpython-312-pytest-8.3.2.pyc
│   │   │   ├── test_urls.cpython-312.pyc
│   │   │   ├── test_urls.cpython-312-pytest-8.3.2.pyc
│   │   │   ├── test_views.cpython-312.pyc
│   │   │   └── test_views.cpython-312-pytest-8.3.2.pyc
│   │   ├── test_models.py
│   │   ├── test_urls.py
│   │   └── test_views.py
│   ├── urls.py
│   └── views.py
├── django.log
├── jest.config.js
├── jest.setup.js
├── manage.py
├── media
│   ├── readme.flows
│   │   ├── interactive.map.flows.png
│   │   ├── profile.management.flow.png
│   │   └── user.reg.authentification.flow.png
│   ├── readme.images
│   │   ├── dive.profile.screenshot.png
│   │   ├── dives.test.pass.png
│   │   ├── home.screenshot.png
│   │   ├── interactive.map.screenshot.png
│   │   ├── login.or.signup.screenshot.png
│   │   ├── login.screenshot.png
│   │   ├── map.help.screenshot.png
│   │   ├── map.snapshot.screenshot.png
│   │   ├── map.tools.screenshot.png
│   │   ├── oceanPinsLogo.png
│   │   ├── profiles.tests.pass.png
│   │   └── register.screenshot.png
│   └── readme.wireframes
│       ├── home.png
│       ├── intmap.png
│       ├── login.png
│       ├── profile.png
│       ├── register.png
│       └── signup.png
├── package.json
├── package-lock.json
├── Procfile
├── profiles
│   ├── admin.py
│   ├── apps.py
│   ├── forms.py
│   ├── __init__.py
│   ├── migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_profile.py
│   │   ├── 0003_profile_map_snapshot_url.py
│   │   ├── 0004_remove_profile_map_snapshot_url.py
│   │   ├── 0005_auto_20240703_1603.py
│   │   ├── 0006_auto_20240703_1610.py
│   │   ├── 0007_auto_20240717_1018.py
│   │   ├── __init__.py
│   │   └── __pycache__
│   │       ├── 0001_initial.cpython-312.pyc
│   │       ├── 0002_auto_20240531_1034.cpython-312.pyc
│   │       ├── 0002_profile.cpython-312.pyc
│   │       ├── 0003_profile_map_snapshot_url.cpython-312.pyc
│   │       ├── 0004_remove_profile_map_snapshot_url.cpython-312.pyc
│   │       ├── 0005_auto_20240703_1603.cpython-312.pyc
│   │       ├── 0006_auto_20240703_1610.cpython-312.pyc
│   │       ├── 0007_auto_20240717_1018.cpython-312.pyc
│   │       └── __init__.cpython-312.pyc
│   ├── models.py
│   ├── __pycache__
│   │   ├── admin.cpython-312.pyc
│   │   ├── apps.cpython-312.pyc
│   │   ├── forms.cpython-312.pyc
│   │   ├── __init__.cpython-312.pyc
│   │   ├── models.cpython-312.pyc
│   │   ├── urls.cpython-312.pyc
│   │   └── views.cpython-312.pyc
│   ├── templates
│   │   └── profiles
│   │       ├── login.html
│   │       ├── login_signup_choice.html
│   │       ├── profile.html
│   │       ├── profile_setup.html
│   │       └── register.html
│   ├── tests
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   │   ├── __init__.cpython-312.pyc
│   │   │   ├── test_forms.cpython-312.pyc
│   │   │   ├── test_forms.cpython-312-pytest-8.3.2.pyc
│   │   │   ├── test_models.cpython-312.pyc
│   │   │   ├── test_models.cpython-312-pytest-8.3.2.pyc
│   │   │   ├── test_urls.cpython-312.pyc
│   │   │   ├── test_urls.cpython-312-pytest-8.3.2.pyc
│   │   │   ├── test_views.cpython-312.pyc
│   │   │   └── test_views.cpython-312-pytest-8.3.2.pyc
│   │   ├── test_forms.py
│   │   ├── test_models.py
│   │   ├── test_urls.py
│   │   └── test_views.py
│   ├── urls.py
│   └── views.py
├── __pycache__
│   └── env.cpython-312.pyc
├── README.md
├── requirements.txt
├── static
│   ├── css
│   │   └── styles.css
│   ├── images
│   │   ├── cartographyTools.png
│   │   ├── clownfish.jpg
│   │   ├── coral2.jpg
│   │   ├── favicon
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon-32x32.png
│   │   │   └── favicon.ico
│   │   ├── hero.jpg
│   │   ├── jellies.jpg
│   │   ├── logo1.png
│   │   ├── mapBackground.png
│   │   ├── markerPin.png
│   │   ├── oceanPinsLogo.png
│   │   ├── openwater.jpg
│   │   ├── profileBackground.png
│   │   ├── seaBackground1.png
│   │   ├── SeaImagery5.png
│   │   ├── SeaImagery6.png
│   │   ├── turtle.jpg
│   │   ├── underwater1.jpg
│   │   └── user_default.png
│   └── javascript
│       ├── map.js
│       ├── readonly_map.js
│       └── script.js
├── templates
│   ├── base.html
│   ├── home.html
│   └── interactive_map.html
└── tests
    └── unit
        ├── clearLocalStorage.test.js
        ├── createClusterContent.test.js
        ├── debounce.test.js
        ├── formatLocation.test.js
        └── getCookie.test.js
```


### Components

- **Frontend**: 
  - **HTML5**
  - **CSS3**
  - **JavaScript**
  - **jQuery**
  - **Bootstrap**

- **Backend**: 
  - **Python 3.12.2**
  - **Django 3.2.25**

- **Database**:
  - **PostgreSQL**: A powerful, open-source object-relational database system, with `psycopg2` as the adapter for Python.

- **Templates**:
  - **Jinja2 3.1.2**: A modern and designer-friendly templating engine for Python, used within Django templates.

### Data Flow

1. **User Actions**: 
    - Users can log in, sign up, add, edit, remove, and view pins (CRUD operations).
    - Users can also perform CRUD operations on their profile, such as editing information and changing their profile photo.

### URLs and Views

- **Profiles Views**:
  - **Login**: `CustomLoginView` handles user authentication, rendering `profiles/login.html`. On successful login, users are redirected to their profile.
  - **Register**: `register` view handles user registration, creating a new user and profile, and redirecting to `profile_setup`.
  - **Profile Setup**: `profile_setup` view allows users to fill out or update their profile details.
  - **Profile**: `profile` view displays the user's profile with an option to update profile details and profile picture.
  - **Profile Picture Upload**: `profile_picture_upload` view handles the upload and update of the user's profile picture.

- **Dives Views**:
  - **Home**: `home` view renders the home page.
  - **Interactive Map**: `interactive_map` view renders the map with the user's dive logs.
  - **Dive Logs**: 
    - `add_dive_log` handles adding new dive logs.
    - `update_dive_log` handles updating existing dive logs.
    - `remove_dive_log` handles removing dive logs.
    - `view_dive_logs` retrieves and displays the user's dive logs.
  - **Markers**: `get_divelog_markers` retrieves dive log markers for display on the map.
  - **Profile View**: `profile_view` renders the profile page with dive logs for the user.

3. **Models and Database**:
    - **Profiles**: The `CustomUser` model extends the default user model to include a bio and profile picture. The `Profile` model links to the `CustomUser` and stores additional information like dive school, certification level, favorite dive site, and more.
    - **Dives**: The `DiveLog` model stores dive logs with details such as date, location, buddy, depth, temperature, visibility, and bottom time.

4. **Templates and Responses**:
    - Data is passed to templates using context dictionaries.
    - Templates are rendered and responses are generated using Django's templating system with Jinja2.
    - The `base.html` template includes common elements like headers, footers, and static files (CSS, JavaScript).

5. **Background Tasks**:
    - Background tasks can be managed using Celery for asynchronous processing.
    - For example, sending confirmation emails or processing large datasets can be handled in the background to improve performance and user experience.

6. **JavaScript and Client-Side Interactions**:
    - **Interactive Map**: Users can interact with a map to add, edit, and remove dive markers. The map is initialized with Google Maps API and supports marker clustering and responsive design.
    - **Marker Management**: Dive markers are managed using the Google Maps API, allowing users to add markers through double-click events, and remove markers with context menus or long presses on mobile.
    - **Responsive Design**: The layout adapts based on screen size, ensuring a user-friendly experience on both desktop and mobile devices.
    - **Local and Session Storage**: Local and session storage are cleared on page load to ensure a fresh state.
    - **AJAX Requests**: CRUD operations on dive logs are performed asynchronously using AJAX requests, enhancing the user experience by avoiding full page reloads.
    - **Form Handling**: Forms for adding and editing dive logs are handled via JavaScript, providing real-time feedback and updates without needing to refresh the page.


## Installation

To install and set up the Ocean Pins project locally, follow these steps:

### Prerequisites

- **Python 3.12.2**
- **PostgreSQL**
- **Git**

### Steps

- To be carried out in your local IDE  terminal;

1. **Clone the Repository**
    ```bash
    git clone https://github.com/SamYatesSmith/oceanpins.git
    cd oceanpins
    ```

2. **Set Up Virtual Environment**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. **Install Python Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4. **Set Up Environment Variables**

    Create a `.env` file in the project root with the following content:
    ```env
    SECRET_KEY=your_secret_key
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1
    DATABASE_URL=postgres://user:password@localhost:5432/oceanpins
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

5. **Set Up the Database**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6. **Create a Superuser**
    ```bash
    python manage.py createsuperuser
    ```

7. **Install Node.js Dependencies**
    ```bash
    npm install
    ```

8. **Run the Development Server**
    ```bash
    python manage.py runserver
    ```

9. **Access the Application**

    Open your web browser and go to `http://localhost:8000`.

### Additional Notes

- **Static and Media Files**: Ensure Cloudinary settings in the `.env` file are correctly configured for managing static and media files.
- **Google Maps API**: Add your Google Maps API key in the relevant JavaScript files to ensure map functionality.  Acquire this from the *Google Cloud Platform*

By following these steps, you will set up the Ocean Pins project on your local machine for development and testing.


## Database Models

-This section provides a detailed overview of the database models used in the Ocean Pins project. It explains the structure of the data, including the fields, relationships, and methods associated with each model.

### Profiles

- **CustomUser**
  - **Fields**:
    - `username`: Standard username field from `AbstractUser`.
    - `email`: Email field for the user.
    - `password`: Password field for user authentication.
    - `bio`: Text field for user biography (optional).
    - `profile_pic`: Image field for the profile picture (optional).
  - **Relationships**:
    - One-to-one relationship with `Profile`.

- **Profile**
  - **Fields**:
    - `user`: One-to-one relationship with `CustomUser`.
    - `dive_school`: Choice field for dive school (PADI, SSI).
    - `cert_level`: Certification level.
    - `fav_dive_site`: Favorite dive site.
    - `next_dive_trip_date`: Date of the next dive trip.
    - `next_dive_location`: Location of the next dive trip.
    - `training_location`: Location of training.
    - `biography`: Text field for biography.
    - `profile_pic`: Cloudinary field for the profile picture with a default image.
  - **Methods**:
    - `__str__()`: Returns the username of the associated user.

### Dives

- **DiveLog**
  - **Fields**:
    - `user`: Foreign key to `CustomUser`.
    - `date`: Date of the dive.
    - `name`: Name of the dive.
    - `location`: Location of the dive.
    - `buddy`: Name of the dive buddy.
    - `depth`: Depth of the dive.
    - `temp`: Temperature of the water.
    - `visibility`: Visibility in the water.
    - `bottom_time`: Bottom time of the dive.
  - **Methods**:
    - `__str__()`: Returns the name of the dive log.

### User Input Data During Signup

- **Registration Form**:
  - **Fields**:
    - `username`: The username chosen by the user.
    - `password1`: The password entered by the user.
    - `password2`: Password confirmation.
    - `email`: User's email address.
  - **Validation**:
    - Ensures that the passwords match and that the username and email are unique.

### Profile Update

- **ProfileForm**:
  - **Fields**:
    - `dive_school`: Choice field for selecting dive school.
    - `cert_level`: Certification level.
    - `fav_dive_site`: Favorite dive site.
    - `next_dive_trip_date`: Date of the next dive trip.
    - `next_dive_location`: Location of the next dive trip.
    - `training_location`: Location of training.
    - `biography`: User biography.
    - `profile_pic`: Profile picture.
  - **Validation**:
    - Ensures all required fields are filled and valid.


## Testing

This section provides an overview of the testing framework, directory structure, and instructions for running tests and generating coverage reports.

## Testing Frameworks

- **Python**: Using `pytest` and Django's built-in test framework.
- **JavaScript**: Using Jest for unit tests.

## Python Tests

The Python tests are organized to test the models, URLs, and views within the Django application. These tests are defined using Django's built-in test framework and `pytest` for more advanced testing features. Test cases are set up to ensure the correct creation and manipulation of model instances, as well as the proper functioning of views and URL mappings.

- Profiles: 

 ![Profiles.py test results](./media/readme.images/profiles.tests.pass.png)

- Dives:

 ![Dives.py test results](./media/readme.images/dives.test.pass.png)

## JavaScript Tests

JavaScript tests are written using Jest and are focused on unit testing the functions within the JavaScript files. These tests ensure that functions like clearing local storage and getting cookies work as expected. They also handle edge cases to maintain robustness.

## Running Tests

### Python Tests
To run Python tests, use the following command:
```bash
python manage.py test
```
### JavaScript Tests
To run Javascript tests, use the following command:
```bash
npm test
```


## Deployment

This section provides a step-by-step guide to deploy the Ocean Pins project.

### Prerequisites

Ensure you have the following software installed:
- Python 3.12.2
- Node.js and npm
- Git
- PostgreSQL (if using PostgreSQL)

### Step 1: Clone the Repository

Clone the repository from GitHub to your local machine:
```bash
git clone https://github.com/SamYatesSmith/oceanpins.git
cd oceanpins
```

### Set Up a Virtual Environment

Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### Install Dependencies

Install the required Python and JavaScript dependencies:
```bash
pip install -r requirements.txt
npm install
```

### Configure Environment Variables

Create a .env file in the project root and configure the following environment variables:
```bash
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=your_database_url  # Example: postgresql://user:password@localhost/dbname
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Apply Database Migrations

Run the following command to apply database migrations:
```bash
python manage.py migrate
```

### Collect Static Files

Collect static files for production:
```bash
python manage.py collectstatic
```

### Run the Development Server

Start the Django development server:
```bash
python manage.py runserver
```

### Deploy to Production

For deploying to a production server, consider using a WSGI server like Gunicorn along with a reverse proxy like Nginx. Here’s a basic example with Gunicorn:

Install Gunicorn:
```bash
pip install gunicorn
```
Run Gunicorn:
```bash
gunicorn dive_proj.wsgi:application
```
Configure Nginx:
Set up an Nginx configuration to proxy pass to Gunicorn.

### Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Gunicorn Documentation](https://docs.gunicorn.org/en/stable/run.html)
- [Nginx Documentation](https://nginx.org/en/docs/)


## Design

The Ocean Pins site was built with a focus on the following core design principles:

1. **DRY (Don't Repeat Yourself)**
   - Attempts to reduce the repetition of code by using abstractions and ensuring that each piece of knowledge or logic is defined only once.  This however needs further work on the back-end.

2. **Template Inheritance**
   - Utilized in the frontend to create a base template that can be extended by other templates, ensuring a consistent look and feel across the site and promoting code reusability.

3. **Loose Coupling**
   - The design promotes minimal dependencies between different components and modules, allowing them to be developed, tested, and maintained independently.

### Core Design Principles

#### 1. Separation of Concerns
   - Ensuring that different functionalities of the application are separated into distinct sections or modules.

#### 2. Reusability
   - Creating components, functions, and modules that can be reused across different parts of the application to reduce redundancy.

#### 3. Scalability
   - Designing the system to handle growth, ensuring that the application can scale efficiently with increased load or complexity.

#### 4. Maintainability
   - Writing clean, well-documented code to ensure that the application is easy to maintain and extend over time.

#### 5. Modularity
   - Dividing the application into smaller, self-contained modules that can be developed and tested independently.

#### 6. Consistency
   - Ensuring a consistent user interface and experience across all parts of the application through the use of common styles, components, and templates.

These principles guide the design and development process, ensuring that the Ocean Pins site is robust, efficient, and maintainable.

## Sequence Diagrams

 - User registration sequences;

 ![User registration Sequence Diagram](./media/readme.flows/user.reg.authentification.flow.png)

 - Profile management sequences;

 ![Profile management Sequence Diagram](./media/readme.flows/profile.management.flow.png) 

 - Interactive map sequences; 

 ![Interactive map Sequence Diagram](./media/readme.flows/interactive.map.flows.png)

### Wireframes

The following wireframes provide a visual representation of the core pages of the Ocean Pins site. They outline the basic structure and layout of each page.

#### 1. Home
![Home Wireframe](./media/readme.wireframes/home.png)

#### 2. Login
![Login Wireframe](./media/readme.wireframes/login.png)

#### 3. Register
![Register Wireframe](./media/readme.wireframes/register.png)

#### 4. Signup
![Signup Wireframe](./media/readme.wireframes/signup.png)

#### 5. Profile
![Profile Wireframe](./media/readme.wireframes/profile.png)

#### 6. Interactive Map
![Interactive Map Wireframe](./media/readme.wireframes/intmap.png)


## User Stories

## User Stories

| ID  | Title                      | User Story                                                                                  | Acceptance Criteria                                                                                               |
| --- | -------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | User Registration          | As a new user, I want to register an account, So that I can log in and use the application.  | 1. The user can navigate to the registration page.<br>2. The user can fill in required details.<br>3. The user receives a confirmation email.<br>4. The user can log in with the registered credentials. |
| 2   | User Login                 | As a user, I want to log in to my account, So that I can access my personalized features.    | 1. The user can navigate to the login page.<br>2. The user can enter their username and password.<br>3. The system validates the user's credentials.<br>4. If valid, the user is logged in and redirected to their dashboard.<br>5. If invalid, the user receives an error message indicating incorrect credentials.<br>6. The user session is maintained until logout or session expiration. |
| 3   | User Logout                | As a user, I want to log out of my account, So that I can ensure my data is secure.          | 1. The user can click on the logout button.<br>2. The system terminates the user's session.<br>3. The user is redirected to the homepage or login page.<br>4. The user receives a confirmation message indicating they have successfully logged out.<br>5. All session data is cleared to prevent unauthorized access. |
| 4   | Update Profile             | As a user, I want to update my profile information, So that I can keep it current.      | 1. The user can navigate to the profile page.<br>2. The user can modify their profile information in the "Your basic Dive details" section.<br>3. The user can save the changes by scrolling to the bottom of this section.<br>4. The system validates and updates the profile information.<br>5. The updated information is displayed on the user's profile page. |
| 6   | Upload Profile Picture     | As a user, I want to upload a profile picture, So that I can personalize my account.    | 1. The user can navigate to the profile page.<br>2. The user can select and upload a profile picture from the "choose file" button at the button of the dive details" section.<br>3. The system validates the image format.<br>4. The updated profile picture is displayed on the user's profile page. |
| 7  | Add Dive Log               | As a user, I want to add a new dive log, So that I can keep track of my diving experiences. | 1. The user can navigate to the Interactive Map page using the navbar or hamburger menu.<br>2. The user can view the "Map Help" section, by clicking on it.<br>3. The user can then double click on the map in the exact location that their dive took place.<br>4.  The map tools section then appears to the side, or bottom, depending on screen size.<br>5. The user input details such as date, location, buddy, depth, temperature, visibility, and bottom time. They then save the dive at the bottom of the form.<br>6. The system validates and saves the dive log information.<br>7. The user receives a confirmation message indicating the dive log has been added successfully.<br>8. The new dive log appears as a pin on the user map and will stay in place unless deleted.|
| 8  | View Dive Log Details      | As a user, I want to view detailed information about each dive log, So that I can review my dives. | 1. The user can click on a dive log marker on the interactive map.<br>2. The system displays detailed information about the dive log.<br>3. The user can see all relevant details (e.g., date, location, depth, buddy).<br>4. The user can navigate back to the map from the details view.<br>5. The details view is consistently formatted for all dive logs. |
| 9   | Edit Dive Log              | As a user, I want to edit a dive log, So that I can correct or update information.          | 1. The user can navigate to the Interactive Map page.<br>2. The user can modify the dive log details by clicking on the appropriate marker.<br>3. The user can save the changes.<br>4. The system validates and updates the dive log information.<br>5. The user receives a confirmation message indicating the dive log has been updated successfully.<br>6. The updated dive log appears on the users map when they highlight their mouse ove the pin, or open it to edit once more. |
| 10  | Delete Dive Log            | As a user, I want to delete a dive log, So that I can remove irrelevant information, or mistakenly placed markers.        | 1. The user can right click on their marker on the Interactive Map page.<br>2. The user can confirm the deletion.<br>3. The system removes the dive log from the database.<br>4. The user receives a confirmation message indicating the dive log has been deleted successfully.<br>5. The dive log is no longer visible \as a marker on the interactive map. |
| 11  | View Dive Logs on Map      | As a user, I want to view my dive logs on an interactive map, So that I can see where I have dived. | 1. The user can navigate to the interactive map page.<br>2. The map displays markers for each dive log.<br>3. The user can click or hover on a marker to view dive log details.<br>4. The user, when they zoom out, will see clustered markers in one small location as a number, indicating how many dives they have experienced in that area.<br>5. The map updates dynamically based on the user's interactions. |
| 9   | Search Dive Locations      | As a user, I want to search for dive locations on the interactive map, So that I can plan new dives. | 1. The user can enter a search query in the search bar.<br>2. The system displays matching locations on the map, from there, the user can find their dive location.<br>3. If a marker is there, the user can click on a location to view more details.<br>4. The map updates to focus on the searched location.<br>5. The user can filter search results by different criteria (e.g., depth, visibility). |
| 10  | Zoom Map                   | As a user, I want to zoom in and out on the interactive map, So that I can navigate easily. | 1. The user can use zoom controls to zoom in and out on the map.<br>2. The map dynamically updates as the user zooms.<br>3. The user can see more details as they zoom in.<br>4. The map maintains performance and usability at different zoom levels.<br>5. The user can reset the zoom level to the default view. |
| 11 | Admin Manage Users         | As an admin, I want to manage user accounts, So that I can maintain order and security.     | 1. The admin can view a list of all users.<br>2. The admin can deactivate or delete user accounts.<br>3. The admin can edit user details.<br>4. The system logs all admin actions for accountability.<br>5. The admin receives confirmation messages for all actions performed. |
| 12  | Admin Approve Dive Logs    | As an admin, I want to review and approve new dive logs, So that I can ensure content quality. | 1. The admin can view a list of pending dive logs.<br>2. The admin can approve or reject dive logs.<br>3. The system notifies users of the admin's decision.
| 13  | Admin Manage Site Settings | As an admin, I want to manage site settings, So that I can ensure proper operation.         | 1. The admin can access the site settings page.<br>2. The admin can modify settings.<br>3. The system saves and applies the changes immediately.<br>4. The admin receives confirmation messages for successful updates.<br>5. The site reflects the updated settings without downtime. |
| 14 | Admin Manage Database      | As an admin, I want to manage the database, So that I can ensure data integrity.            | 1. The admin can access the database management page.<br>2. The admin can perform database backups.<br>3. The admin can restore the database from a backup.<br>4. The admin can view and modify database entries.<br>5. The system logs all database management actions for accountability. |


## Future Developments

| ID  | Title                      | User Story                                                                                  | Acceptance Criteria                                                                                               | Priority  |
| --- | -------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------- |
| 15  | View Dive Statistics       | As a user, I want to view statistics about my dives, So that I can analyze my diving history. | 1. The user can navigate to the profile page.<br>2. The system displays statistics such as total dives, average depth, and favorite dive locations.<br>3. The statistics are visually represented through charts and graphs.<br>4. The user can filter statistics by date range. | High      |
| 16  | Share Dive Logs            | As a user, I want to share my dive logs on social media, So that I can show my experiences. | 1. The user can select a dive log to share.<br>2. The user can choose from various social media platforms.<br>3. The system generates a shareable link or post.<br>4. The user receives a confirmation message indicating the dive log has been shared successfully. | Medium    |
| 17  | Follow Dive Sites          | As a user, I want to follow specific dive sites, or popular dive areas around the world, So that I can receive updates about them, or advisories to add them to a wishlist. | 1. The user can search for and follow dive sites.<br>2. The system notifies the user of updates or new dive logs from followed sites.<br>3. The user can manage followed sites in their profile settings.<br>4. The user receives a confirmation message when a site is followed successfully. | Medium    |
| 18  | Dive Log Reminders         | As a user, I want to set reminders for my next dive trips, So that I can plan my dives effectively. | 1. The user can set a reminder for a dive trip.<br>2. The system sends a notification to the user at the set time.<br>3. The user can view and manage reminders in their profile.<br>4. The user receives a confirmation message when a reminder is set successfully. | Low       |
| 19  | Import Dive Data           | As a user, I want to import dive data from other apps, So that I can consolidate my dive logs. | 1. The user can navigate to the import data page.<br>2. The user can select a compatible app or file format for import.<br>3. The system imports the dive data and integrates it with existing logs.<br>4. The user receives a confirmation message indicating the data has been imported successfully. | Medium    |
| 20  | Export Dive Data           | As a user, I want to export my dive data, So that I can have an offline backup. | 1. The user can navigate to the export data page.<br>2. The user can select a file format for export.<br>3. The system generates and downloads the file.<br>4. The user receives a confirmation message indicating the data has been exported successfully. | High    |
| 21  | View Dive Site Weather     | As a user, I want to view current weather conditions at dive sites, So that I can plan my dives accordingly. | 1. The user can search for a dive site.<br>2. The system displays current weather conditions for the selected site.<br>3. The weather information is updated in real-time.<br>4. The user can view weather forecasts for the upcoming days. | High      |
| 22  | Dive Site Reviews          | As a user, I want to read and write reviews for dive sites, So that I can share and learn from other divers' experiences. | 1. The user can navigate to a dive site's page.<br>2. The user can read reviews from other divers.<br>3. The user can write and submit their own review.<br>4. The system displays reviews in a chronological order.<br>5. The user receives a confirmation message when a review is submitted successfully. | Low       |
| 23  | Dive Equipment Tracking    | As a user, I want to track my dive equipment, So that I can manage my gear efficiently. | 1. The user can navigate to the equipment tracking page.<br>2. The user can add and edit equipment details.<br>3. The system tracks equipment usage and maintenance dates.<br>4. The user receives notifications for upcoming maintenance. | Low    |
| 24  | Friend Recommendations     | As a user, I want to receive friend recommendations, So that I can connect with other divers. | 1. The system suggests friends based on mutual connections and diving interests.<br>2. The user can view and send friend requests.<br>3. The user receives notifications for accepted friend requests.<br>4. The recommendations update dynamically based on user interactions. | Low       |
| 25  | Social Media Wall              | As a user, I want a social media wall, So that I can see updates and posts from other divers. | 1. The user can view a social media wall with posts from other divers.<br>2. The user can like and comment on posts.<br>3. The system updates the wall in real-time.<br>4. The user receives notifications for interactions on their posts. | Low    |
| 26  | Dive Wishlist                  | As a user, I want to create a wishlist of dive sites, So that I can plan future dives. | 1. The user can add dive sites to their wishlist.<br>2. The user can view and manage their wishlist.<br>3. The system notifies the user of updates or new information about wishlist sites.<br>4. The wishlist is accessible from the user's profile. | Medium    |
| 27  | Photo Gallery                  | As a user, I want a photo gallery, So that I can upload and view dive photos. | 1. The user can upload photos to their gallery.<br>2. The user can view and manage their photo gallery.<br>3. The system displays photos in an organized manner.<br>4. The user can add descriptions and tags to their photos. | High  |
| 28  | AI Recognition of Wildlife     | As a user, I want AI recognition of wildlife in my dive photos, So that I can identify marine life. | 1. The user can upload photos for AI analysis.<br>2. The system identifies and labels wildlife in the photos.<br>3. The user receives detailed information about identified species.<br>4. The identified wildlife is tagged in the user's photo gallery. | Medium    |


## Code Validation

### Python Linting

We use `flake8` for linting Python code. This tool checks for style guide enforcement and logical errors.

1. **Install flake8**:
   ```
   pip install flake8
   ```
2. **Run flake8**
   ```
   flake8 .
   Or
   flake8 /workspace/oceanpins/dives
   flake8 /workspace/oceanpins/profiles
   flake8 /workspace/oceanpins/dives
   ```

### CSS Validation

https://jigsaw.w3.org/css-validator/validator

 ![CSS code validation](./media/readme.linting/css.validation.png)

### JavaScript Validation

 - No major concerns.

  ![JavaScript code validation](./media/readme.linting/javascript.validation.png)

### HTML Validation

#### Known Issues;

 1. HTML Validation "Register.html" , "profile_setup.html"
#### Decision to Use `{{ form.as_p }}`

1. **Convenience and Speed**
   - Using `{{ form.as_p }}` provides a quick and straightforward way to render forms. This method eliminates the need for manually coding each field, which significantly speeds up the development process.

2. **Consistency**
   - By utilizing `{{ form.as_p }}`, we ensure that all form fields are consistently structured. This consistency reduces the risk of errors that can occur with manual HTML coding, making the codebase more reliable.

3. **General Acceptance**
   - `{{ form.as_p }}` is widely accepted within the Django community. It works well for many applications, particularly when the forms are relatively simple, making it a trusted method for form rendering.

4. **Trade-off Acknowledgment**
   - While there are minor HTML validation issues associated with `{{ form.as_p }}`, we have decided to accept this trade-off. The convenience, speed, consistency, and general acceptance provided by this method outweigh the minor drawbacks. This decision allows us to maintain cleaner and more maintainable code, enabling us to focus on the core functionality of the application without getting bogged down in manual HTML rendering.

All other pages pass validation with no errors or warnings to show. 


## Troubleshooting

### Known Bugs

1. **Did not correctly adhere to DRY**: Duplicated URLs and views are creating conflicts in profiles, dives, and dive_proj. This issue is due to a lack of familiarity with structuring the code. While it has not affected functionality, it needs to be resolved before adding new features.
   - **Repair Priority**: High

2. **Intermittent error on the map: Missing IDs**: Occasionally, there is an ID missing error when the map loads. This usually disappears on zoom when the map refreshes.
   - **Repair Priority**: Medium

3. **Styling issues on Profile Page**: Long usernames overlap the screen edge.
   - **Repair Priority**: High

4. **Screen Size**: The site works better on larger screens.
   - **Repair Priority**: Low

5. **Mobile Performance**: The site does not perform well in landscape mode on mobile phones due to navbars with fixed heights.
   - **Repair Priority**: Low

6. **Interactive Map Hover Issue**: The hover-over marker feature occasionally requires refreshing to view updated data.
   - **Repair Priority**: High

7. **Mobile Performance**:  The map markers do not always register the finger hold down on markers to delete.  Zoom i nto max on marker required.  Assumed location paramters are too strict.
   - **Repair Priority**: High   


## Contributors

- **Sam Yates-Smith**: Creator and developer at Ocean Pins. You can reach out to Sam for any questions or contributions to the project.

- https://codepen.io/FurqanAnwar/pen/wvwRpoQ - Rough guideline/inspiration for home.html's "wavy-text"
- https://chatgpt.com/ - Advice and understanding of syntax and construction.
- https://www.midjourney.com - All images created using this service.
- https://fonts.google.com/ - all fonts borrowed from this service
- https://cloud.google.com/?hl=en - API's untilised, provided by this service
- https://github.com/ - Repository at this service
- https://id.heroku.com/ - Hosting and deployment with this service
- https://gitpod.io - Workspace with this service
- https://validator.w3.org - HTML validation
- https://jigsaw.w3.org/css-validator/ - CSS validation
- https://jshint.com/ - JavaScript validation
- https://mycolor.space/ - Colour gradient matching
- https://webaim.org/resources/contrastchecker/ - Contrast cchecker
- https://convertio.co/ - Image file converter
- https://www.pexels.com/ - Image provision
- https://balsamiq.cloud/ - Wireframe production with this service
- https://www.fotor.com/features/remove-background-from-logo/ - Background removal from images
- https://learn.codeinstitute.net/ - General guidance
- ERD generation through Python: 
  > 
  ```bash
  sudo apt-get install tree
  tree
  ```