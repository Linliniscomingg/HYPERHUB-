from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=25, unique=True, null=False, blank=False)
    password = models.CharField(max_length=25, null=False, blank=False)
    full_name = models.CharField(max_length=256, default='')
    phone = models.CharField(max_length=11, null=False, blank=False)

    class Meta:
        ordering = ['username']

    def __str__(self):
        return self.full_name
