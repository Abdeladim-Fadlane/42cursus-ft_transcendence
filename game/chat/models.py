from django.db import models

# Create your models here.


class Room(models.Model):
    name = models.CharField(max_length=1000)
    label = models.SlugField(unique=True)

    def __str__(self):
        return self.label