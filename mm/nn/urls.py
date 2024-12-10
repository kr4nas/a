from django.urls import path
from .views import ScheduleView

urlpatterns = [
    path('update_nn/<str:group>/<str:date>/', ScheduleView.as_view(), name='update_schedule'),
    path('get_nn/<str:group>/<str:date>/', ScheduleView.as_view(), name='get_schedule'),
]