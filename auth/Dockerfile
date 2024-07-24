FROM python:3

RUN apt-get update && \
    apt-get install -y postgresql-client

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


COPY . .

CMD ["./script.sh"]