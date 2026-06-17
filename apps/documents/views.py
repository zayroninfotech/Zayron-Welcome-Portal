from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from apps.employees.models import Employee
from .models import EmployeeDetails
from .serializers import EmployeeDetailsSerializer


class EmployeeDetailsSubmitView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, token):
        try:
            employee = Employee.objects.get(onboarding_token=token)
        except Employee.DoesNotExist:
            return Response({'error': 'Invalid onboarding link.'}, status=status.HTTP_404_NOT_FOUND)

        if not hasattr(employee, 'ndadocument'):
            return Response({'error': 'Please complete NDA first.'}, status=status.HTTP_400_BAD_REQUEST)

        if hasattr(employee, 'employeedetails'):
            return Response({'error': 'Details already submitted.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['employee'] = employee.id

        serializer = EmployeeDetailsSerializer(data=data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        details = serializer.save()

        # Mark employee as completed
        employee.status = 'completed'
        employee.save()

        return Response(EmployeeDetailsSerializer(details, context={'request': request}).data, status=status.HTTP_201_CREATED)


class EmployeeDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        try:
            details = EmployeeDetails.objects.get(employee_id=employee_id)
            return Response(EmployeeDetailsSerializer(details, context={'request': request}).data)
        except EmployeeDetails.DoesNotExist:
            return Response({'error': 'Details not found.'}, status=status.HTTP_404_NOT_FOUND)
