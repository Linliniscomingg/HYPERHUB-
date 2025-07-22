from django import forms
from .models import User

class UserCreationForm(forms.ModelForm):
    """
    A form that creates a user, with no privileges, from the given username.
    """
    class Meta:
        model = User
        fields = ('username',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self._meta.model.USERNAME_FIELD in self.fields:
            self.fields[self._meta.model.USERNAME_FIELD].widget.attrs['autofocus'] = True

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user