from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    Category,
    ChargePlanLine,
    Comment,
    Person,
    Post,
    Project,
    User,
)

admin.site.site_title = "Myapp"
admin.site.site_header = f"{admin.site.site_title} Administration"
admin.site.index_title = admin.site.site_header

admin.site.register(Category, admin.ModelAdmin)
admin.site.register(ChargePlanLine, admin.ModelAdmin)
admin.site.register(Comment, admin.ModelAdmin)
admin.site.register(Person, admin.ModelAdmin)
admin.site.register(Post, admin.ModelAdmin)
admin.site.register(Project, admin.ModelAdmin)
admin.site.register(User, UserAdmin)
