from django.contrib import admin
from django.urls import path
import feedpage.views
import accounts.views
from django.conf.urls import include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', feedpage.views.index, name='index'),
    path('feeds/', include('feedpage.urls')),
    # path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/signup/', accounts.views.signup, name='signup'),
    path('accounts/<int:uid>/', accounts.views.mypage, name="mypage"),
    path('accounts/<int:uid>/edit/', accounts.views.edit_profile, name="edit_profile"),
    path('<int:pk>/follow/', accounts.views.follow_manager, name='follow'),    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
 