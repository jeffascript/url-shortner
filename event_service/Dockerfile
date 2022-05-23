# FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

# COPY . /event_service

# # COPY ./file.sh /event_service
# # ENTRYPOINT ["/file.sh"]

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]


FROM python:3.9

WORKDIR /event_service

COPY ./requirements.txt /event_service/requirements.txt

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./app /event_service/app

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80" ]