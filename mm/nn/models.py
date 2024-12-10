from django.db import models

class Schedule(models.Model):
    group = models.CharField(max_length=10)
    date = models.DateField()
    content = models.TextField()

    def __str__(self):
        return f"{self.group} - {self.date}"