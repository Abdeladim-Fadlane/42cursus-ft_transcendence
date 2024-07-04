FROM python:3

WORKDIR /code

COPY requirements.txt .

COPY ./script.sh .

RUN chmod +x script.sh

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["./script.sh"]