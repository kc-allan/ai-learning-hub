- setup: `pip install -r requirements.txt`
- run: `python manage.py runserver`
## checkout the docs at `http://localhost:8000/api/v1/docs` to get endpoints
- Swagger Api docs route: `http://localhost:8000/api/v1/docs`

## Also run
```py
python manage.py seed_courses
```
- This populates db with some courses and Quizzees described [here](lesson\management\commands\seed_courses.py)