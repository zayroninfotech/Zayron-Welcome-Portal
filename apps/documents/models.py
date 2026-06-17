from django.db import models


class EmployeeDetails(models.Model):
    GENDER_CHOICES = [('male', 'Male'), ('female', 'Female'), ('other', 'Other')]
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'),
    ]

    employee = models.OneToOneField('employees.Employee', on_delete=models.CASCADE, related_name='employeedetails')
    father_name = models.CharField(max_length=200)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    address = models.TextField()
    qualification = models.CharField(max_length=200)
    previous_experience = models.TextField(blank=True)
    pan_number = models.CharField(max_length=10)
    aadhaar_number = models.CharField(max_length=12)
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=11)
    emergency_contact_name = models.CharField(max_length=200)
    emergency_contact = models.CharField(max_length=15)
    # Documents
    photograph = models.FileField(upload_to='photos/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    aadhaar_copy = models.FileField(upload_to='aadhaar/', null=True, blank=True)
    pan_copy = models.FileField(upload_to='pan/', null=True, blank=True)
    educational_certificates = models.FileField(upload_to='certificates/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Details - {self.employee.name}"
