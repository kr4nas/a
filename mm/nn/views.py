from django.shortcuts import render

from django.http import JsonResponse
from django.views import View
from .models import Schedule
import json

class ScheduleView(View):
    def get(self, request, group, date):
        try:
            schedule = Schedule.objects.get(group=group, date=date)
            return JsonResponse({'content': schedule.content}, status=200)
        except Schedule.DoesNotExist:
            return JsonResponse({'error': 'Schedule not found'}, status=404)

    def put(self, request, group, date):
        data = json.loads(request.body)
        content = data.get('content', '')

        schedule, created = Schedule.objects.update_or_create(
            group=group,
            date=date,
            defaults={'content': content}
        )
        return JsonResponse({'message': 'Schedule updated successfully'}, status=200)